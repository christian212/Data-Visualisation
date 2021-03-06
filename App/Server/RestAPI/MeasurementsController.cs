using AspCoreServer.Data;
using AspCoreServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;
using CsvHelper;
using Microsoft.AspNetCore.Authorization;

namespace AspCoreServer.Controllers
{

    [Route("api/[controller]")]
    public class MeasurementsController : Controller
    {
        private readonly IHostingEnvironment _environment;
        private readonly SpaDbContext _context;

        const int maxDatapoints = 500;

        public MeasurementsController(IHostingEnvironment environment, SpaDbContext context)
        {
            _context = context;
            _environment = environment;
        }

        [Authorize]
        [HttpGet("[action]")]
        public async Task<IActionResult> Count()
        {
            var measurementCount = await _context.Measurements.CountAsync();

            return Ok(measurementCount);
        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get(int currentPageNo = 1, int pageSize = 1000)
        {
            var measurements = await _context.Measurements
                .OrderByDescending(s => s.Created)
                .Skip((currentPageNo - 1) * pageSize)
                .Take(pageSize)
                .ToArrayAsync();

            if (!measurements.Any())
            {
                return NotFound("Measurements not Found");
            }
            else
            {
                return Ok(measurements);
            }
        }

        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var measurement = await _context.Measurements
                .Where(s => s.Id == id)
                .AsNoTracking()
                .Include(s => s.Cell)
                .Include(s => s.Stack)
                .Include(s => s.Battery)
                .Include(s => s.RawMeasurements)
                .SingleOrDefaultAsync(m => m.Id == id);

            if (measurement == null)
            {
                return NotFound("Measurement not Found");
            }
            else
            {
                if (measurement.Cell != null)
                {
                    var cell = new Cell();
                    cell.Id = measurement.Cell.Id;
                    measurement.Cell = cell;
                }
                else if (measurement.Stack != null)
                {
                    var stack = new Stack();
                    stack.Id = measurement.Stack.Id;
                    measurement.Stack = stack;
                }
                else if (measurement.Battery != null)
                {
                    var battery = new Battery();
                    battery.Id = measurement.Battery.Id;
                    measurement.Battery = battery;
                }

                measurement.RawMeasurements = measurement.RawMeasurements.OrderBy(m => m.Frequency).ToList();

                return Ok(measurement);
            }
        }

        [Authorize]
        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> Locus(int id)
        {
            var measurement = await _context.Measurements
                .Where(s => s.Id == id)
                .AsNoTracking()
                .SingleOrDefaultAsync(m => m.Id == id);

            if (measurement == null)
            {
                return NotFound("Measurement Data not Found");
            }
            else
            {
                var json = System.IO.File.ReadAllText(measurement.FilePath);

                var locusFile = new LocusFile();
                JsonConvert.PopulateObject(json, locusFile);

                var locus = new Locus();
                locus.Name = "ID " + measurement.Id + ": Impedanz";
                locus.Data = new List<ComplexPoint>();

                foreach (var rawPoint in locusFile.Spectrum.Impedance._ArrayData_.Select((value, i) => new { i, value }))
                {
                    var point = new ComplexPoint(rawPoint.value[0] * 1000, rawPoint.value[1] * 1000);
                    point.Frequency = locusFile.Spectrum.Frequency[rawPoint.i];

                    locus.Data.Add(point);
                }

                return Ok(Json(new Locus[] { locus }));
            }
        }

        [Authorize]
        [HttpGet("[action]/{id}/{lowerBound}/{upperBound}")]
        public async Task<IActionResult> TimeSeries(int id, long lowerBound, long upperBound)
        {
            var measurement = await _context.Measurements
               .Where(s => s.Id == id)
               .AsNoTracking()
               .SingleOrDefaultAsync(m => m.Id == id);

            if (measurement == null)
            {
                return NotFound("Measurement Data not Found");
            }
            else
            {
                var json = System.IO.File.ReadAllText(measurement.FilePath);

                var timeSeriesFile = new TimeSeriesFile();
                JsonConvert.PopulateObject(json, timeSeriesFile);

                var rows = new List<CsvRow>();

                for (int i = 0; i < timeSeriesFile.Data.Length - 1; i++)
                {
                    var row = new CsvRow();

                    row.UnixTimestamp = timeSeriesFile.Data[i].Time;
                    row.Voltage = timeSeriesFile.Data[i].Voltage;
                    row.Current = timeSeriesFile.Data[i].Current;
                    row.Charge = timeSeriesFile.Data[i].Capacity;

                    rows.Add(row);
                }

                if (lowerBound == 0)
                {
                    lowerBound = rows.Min(row => row.UnixTimestamp);
                }
                if (upperBound == 0)
                {
                    upperBound = rows.Max(row => row.UnixTimestamp);
                }

                var filteredRows = rows.Where(row => row.UnixTimestamp >= lowerBound & row.UnixTimestamp <= upperBound).ToList();

                var timeseriesVoltage = new TimeSeries();
                var timeseriesCurrent = new TimeSeries();
                var timeseriesCharge = new TimeSeries();

                timeseriesVoltage.Name = "ID " + measurement.Id + ": Spannung";
                timeseriesVoltage.Tooltip = new Tooltip(" V");
                timeseriesCurrent.Name = "ID " + measurement.Id + ": Strom";
                timeseriesCurrent.Tooltip = new Tooltip(" A");
                timeseriesCharge.Name = "ID " + measurement.Id + ": Ladung";
                timeseriesCharge.Tooltip = new Tooltip(" As");

                var voltage = new double[filteredRows.Count()][];
                var current = new double[filteredRows.Count()][];
                var charge = new double[filteredRows.Count()][];

                foreach (var row in filteredRows.Select((value, i) => new { i, value }))
                {
                    voltage[row.i] = new double[2];
                    voltage[row.i][0] = row.value.UnixTimestamp;
                    voltage[row.i][1] = row.value.Voltage;

                    current[row.i] = new double[2];
                    current[row.i][0] = row.value.UnixTimestamp;
                    current[row.i][1] = row.value.Current;

                    charge[row.i] = new double[2];
                    charge[row.i][0] = row.value.UnixTimestamp;
                    charge[row.i][1] = row.value.Charge;
                }

                timeseriesVoltage.Data = ReduceDataPoints(maxDatapoints, voltage);
                timeseriesCurrent.Data = ReduceDataPoints(maxDatapoints, current);
                timeseriesCharge.Data = ReduceDataPoints(maxDatapoints, charge);

                var timeseriesArray = new TimeSeries[] { timeseriesVoltage, timeseriesCurrent, timeseriesCharge };

                return Ok(Json(timeseriesArray));
            }
        }

        [Authorize]
        [HttpGet("[action]/{id}/{index}/{lowerBound}/{upperBound}")]
        public async Task<IActionResult> RawTimeseries(int id, int index, double lowerBound, double upperBound)
        {
            var measurement = await _context.Measurements
                .Where(s => s.Id == id)
                .AsNoTracking()
                .SingleOrDefaultAsync(m => m.Id == id);

            if (measurement == null)
            {
                return NotFound("Measurement Data not Found");
            }
            else
            {
                var json = System.IO.File.ReadAllText(measurement.FilePath);

                var locusFile = new LocusFile();
                JsonConvert.PopulateObject(json, locusFile);

                var rawData = locusFile.RawData[index];

                var rows = new List<CsvRow>();

                for (int i = 0; i < rawData.Timepoints.Length - 1; i++)
                {
                    var row = new CsvRow();

                    row.RelativeTime = rawData.Timepoints[i];
                    row.Voltage = rawData.Voltage[i];
                    row.Current = rawData.Current[i];

                    rows.Add(row);
                }

                if (lowerBound == 0)
                {
                    lowerBound = rows.Min(row => row.RelativeTime);
                }
                if (upperBound == 0)
                {
                    upperBound = rows.Max(row => row.RelativeTime);
                }

                var filteredRows = rows.Where(row => row.RelativeTime >= lowerBound & row.RelativeTime <= upperBound).ToList();

                var timeseriesVoltage = new TimeSeries();
                var timeseriesCurrent = new TimeSeries();

                timeseriesVoltage.Name = "ID " + measurement.Id + ": Spannung bei " + rawData.Frequency + " Hz";
                timeseriesVoltage.Tooltip = new Tooltip(" V");
                timeseriesCurrent.Name = "ID " + measurement.Id + ": Strom bei " + rawData.Frequency + " Hz";
                timeseriesCurrent.Tooltip = new Tooltip(" A");

                var voltage = new double[filteredRows.Count()][];
                var current = new double[filteredRows.Count()][];

                foreach (var row in filteredRows.Select((value, i) => new { i, value }))
                {
                    voltage[row.i] = new double[2];
                    voltage[row.i][0] = row.value.RelativeTime;
                    voltage[row.i][1] = row.value.Voltage;

                    current[row.i] = new double[2];
                    current[row.i][0] = row.value.RelativeTime;
                    current[row.i][1] = row.value.Current;
                }

                timeseriesVoltage.Data = ReduceDataPoints(maxDatapoints, voltage);
                timeseriesCurrent.Data = ReduceDataPoints(maxDatapoints, current);

                var timeseriesArray = new TimeSeries[] { timeseriesVoltage, timeseriesCurrent };

                return Ok(Json(timeseriesArray));
            }
        }

        double[][] ReduceDataPoints(int Datapoints, double[][] array)
        {
            if (Datapoints > array.Count())
            {
                Datapoints = array.Count();
            }

            int nSeries = 2;

            if (array.Length > 0)
            {
                nSeries = array[0].Length;
            }

            // Set step size
            float step = (float)(array.Count() - 1) / (Datapoints - 1);

            var arrayReduced = new double[Datapoints][];

            for (int i = 0; i < Datapoints; i++)
            {
                arrayReduced[i] = new double[nSeries];

                // Add each element of a position which is a multiple of step to arrayReduced
                for (int j = 0; j < nSeries; j++)
                {
                    arrayReduced[i][j] = array[(int)Math.Round(step * i)][j];
                }
            }

            return arrayReduced;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Measurement measurement)
        {
            if (!string.IsNullOrEmpty(measurement.Name))
            {
                _context.Add(measurement);
                await _context.SaveChangesAsync();
                return CreatedAtAction("Post", measurement);
            }
            else
            {
                return BadRequest("The Measurement's name was not given");
            }
        }

        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]Measurement measurementUpdateValue)
        {
            try
            {
                measurementUpdateValue.Modified = DateTime.Now.ToUniversalTime();

                var measurementToEdit = await _context.Measurements
                  .AsNoTracking()
                  .SingleOrDefaultAsync(m => m.Id == id);

                if (measurementToEdit == null)
                {
                    return NotFound("Could not update measurement as it was not Found");
                }
                else
                {
                    _context.Update(measurementUpdateValue);
                    await _context.SaveChangesAsync();
                    return Ok("Updated measurement - " + measurementUpdateValue.Name);
                }
            }
            catch (DbUpdateException)
            {
                //Log the error (uncomment ex variable name and write a log.)
                ModelState.AddModelError("", "Unable to save changes. " +
                    "Try again, and if the problem persists, " +
                    "see your system adlowerBoundistrator.");
                return NotFound("Measurement not Found");
            }
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var measurementToRemove = await _context.Measurements
                .AsNoTracking()
            .SingleOrDefaultAsync(m => m.Id == id);
            if (measurementToRemove == null)
            {
                return NotFound("Could not delete measurement as it was not Found");
            }
            else
            {
                var filePath = Path.Combine(_environment.WebRootPath,
                "uploads", "Measurements", measurementToRemove.Id.ToString());

                if (System.IO.Directory.Exists(filePath))
                {
                    System.IO.Directory.Delete(filePath, true);
                }

                _context.Measurements.Remove(measurementToRemove);
                await _context.SaveChangesAsync();
                return Ok("Deleted measurement - " + measurementToRemove.Name);
            }
        }
    }

}