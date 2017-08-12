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

namespace AspCoreServer.Controllers
{

    [Route("api/[controller]")]
    public class MeasurementsController : Controller
    {
        private readonly IHostingEnvironment _environment;
        private readonly SpaDbContext _context;

        public MeasurementsController(IHostingEnvironment environment, SpaDbContext context)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Count()
        {
            var measurementCount = await _context.Measurements.CountAsync();

            return Ok(measurementCount);
        }

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

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var measurement = await _context.Measurements
                .Where(s => s.Id == id)
                .AsNoTracking()
                .SingleOrDefaultAsync(m => m.Id == id);

            if (measurement == null)
            {
                return NotFound("Measurement not Found");
            }
            else
            {
                return Ok(measurement);
            }
        }

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
                var filePath = Path.Combine(_environment.WebRootPath,
                "uploads", "Measurements", measurement.Id.ToString(), measurement.FileName);

                var json = System.IO.File.ReadAllText(filePath);

                var locusFile = new LocusFile();
                JsonConvert.PopulateObject(json, locusFile);

                var locus = new Locus();
                locus.Name = "ID " + measurement.Id + ": Impedanz";
                locus.Data = new List<ComplexPoint>();

                foreach (var rawPoint in locusFile.Spectrum.Impedance.ArrayData.Select((value, i) => new { i, value }))
                {
                    var point = new ComplexPoint(rawPoint.value[0] * 1000, rawPoint.value[1] * 1000);
                    point.Frequency = locusFile.Spectrum.Frequency[rawPoint.i];

                    locus.Data.Add(point);
                }

                return Ok(Json(new Locus[] { locus }));
            }
        }

        [HttpGet("[action]/{id}/{min}/{max}")]
        public async Task<IActionResult> TimeSeries(int id, long min, long max)
        {
            var maxDatapoints = 500;

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
                var filePath = Path.Combine(_environment.WebRootPath,
                "uploads", "Measurements", measurement.Id.ToString(), measurement.FileName);

                FileStream fileStream = new FileStream(filePath, FileMode.Open);
                StreamReader reader = new StreamReader(fileStream);

                var csv = new CsvReader(reader);
                var records = csv.GetRecords<Record>().ToList();

                var rows = new List<Row>();

                foreach (var record in records)
                {
                    var row = new Row();

                    row.UnixTimestamp = new DateTimeOffset(new DateTime(record.Jahr, record.Monat, record.Tag, record.Stunde, record.Minute, record.Sekunde, DateTimeKind.Utc)).ToUnixTimeSeconds();
                    row.Spannung = record.Spannung;
                    row.Strom = record.Strom;

                    rows.Add(row);
                }

                if (min == 0){
                    min = rows.Min(row => row.UnixTimestamp);
                }
                if (max == 0){
                    max = rows.Max(row => row.UnixTimestamp);
                }

                var filteredRows = rows.Where(row => row.UnixTimestamp >= min & row.UnixTimestamp <= max).ToList();

                var timeseriesVoltage = new TimeSeries();
                var timeseriesCurrent = new TimeSeries();

                timeseriesVoltage.Name = "ID " + measurement.Id + ": Spannung";
                timeseriesVoltage.Tooltip = new Tooltip(" V");
                timeseriesCurrent.Name = "ID " + measurement.Id + ": Strom";
                timeseriesCurrent.Tooltip = new Tooltip(" A");

                var voltage = new double[filteredRows.Count()][];
                var current = new double[filteredRows.Count()][];

                foreach (var row in filteredRows.Select((value, i) => new { i, value }))
                {
                    voltage[row.i] = new double[2];
                    voltage[row.i][0] = row.value.UnixTimestamp * 1000;
                    voltage[row.i][1] = row.value.Spannung;

                    current[row.i] = new double[2];
                    current[row.i][0] = row.value.UnixTimestamp * 1000;
                    current[row.i][1] = row.value.Strom;
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

            // Set step size
            float step = (float)(array.Count() - 1) / (Datapoints - 1);

            var arrayReduced = new double[Datapoints][];

            for (int i = 0; i < Datapoints; i++)
            {
                arrayReduced[i] = new double[2];

                // Add each element of a position which is a multiple of step to arrayReduced
                arrayReduced[i][0] = array[(int)Math.Round(step * i)][0];
                arrayReduced[i][1] = array[(int)Math.Round(step * i)][1];
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
                    "see your system administrator.");
                return NotFound("Measurement not Found");
            }
        }

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