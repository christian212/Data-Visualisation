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

                var locus = new Locus();
                JsonConvert.PopulateObject(json, locus);

                var timeseriesImpedance = new TimeSeries();
                timeseriesImpedance.Name = "Impedanz";

                timeseriesImpedance.Data = locus.Spectrum.Impedance.ArrayData;

                var result = new TimeSeries[] { timeseriesImpedance };

                return Ok(Json(result));
            }
        }

        [HttpGet("[action]/{id}")]
        public async Task<IActionResult> TimeSeries(int id)
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

                FileStream fileStream = new FileStream(filePath, FileMode.Open);
                StreamReader reader = new StreamReader(fileStream);

                var csv = new CsvReader(reader);
                var records = csv.GetRecords<Record>().ToList();

                var timeseriesVoltage = new TimeSeries();
                var timeseriesCurrent = new TimeSeries();

                timeseriesVoltage.Name = "Spannung in Volt";
                timeseriesCurrent.Name = "Strom in Ampere";

                var voltage = new double[records.Count()][];
                var current = new double[records.Count()][];

                for (int i = 0; i < records.Count(); i++)
                {
                    voltage[i] = new double[2];
                }

                for (int i = 0; i < records.Count(); i++)
                {
                    current[i] = new double[2];
                }

                foreach (var record in records.Select((value, i) => new { i, value }))
                {
                    var timestamp = new DateTimeOffset(new DateTime(record.value.Jahr, record.value.Monat, record.value.Tag, record.value.Stunde, record.value.Minute, record.value.Sekunde, DateTimeKind.Utc)).ToUnixTimeSeconds() * 1000;
                    voltage[record.i][0] = timestamp;
                    voltage[record.i][1] = record.value.Spannung;

                    current[record.i][0] = timestamp;
                    current[record.i][1] = record.value.Strom;
                }

                timeseriesVoltage.Data = voltage;
                timeseriesCurrent.Data = current;

                var timeseriesArray = new TimeSeries[] { timeseriesVoltage, timeseriesCurrent };

                var result = Json(timeseriesArray);

                return Ok(result);
            }
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
                measurementUpdateValue.Modified = DateTime.Now;

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