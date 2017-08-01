using AspCoreServer.Data;
using AspCoreServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Data;
using System.Collections.Generic;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace AspCoreServer.Controllers
{

    [Route("api/[controller]")]
    public class MeasurementsController : Controller
    {
        private readonly SpaDbContext _context;

        public MeasurementsController(SpaDbContext context)
        {
            _context = context;
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
        public async Task<IActionResult> Data(int id)
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
                // FileStream fileStream = new FileStream(measurement.FilePath, FileMode.Open);
                // using (StreamReader reader = new StreamReader(fileStream))
                // {
                //     string line = reader.ReadToEnd();

                //     return Ok(line);
                // }

                var json = System.IO.File.ReadAllText(measurement.FilePath);

                var timeseries1 = new TimeSeries();
                var timeseries2 = new TimeSeries();
                var timeseries3 = new TimeSeries();

                timeseries1.Name = "TimeSeries Objekt 1 vom Server";
                timeseries2.Name = "TimeSeries Objekt 2 vom Server";
                timeseries3.Name = "Geladen von Disk";

                var data1 = new float[10][];
                var data2 = new float[10][];

                for (int i = 0; i < data1.Length; i++)
                {
                    data1[i] = new float[2];
                }

                for (int i = 0; i < data2.Length; i++)
                {
                    data2[i] = new float[2];
                }

                int Min = 0;
                int Max = 20;

                Random randNum1 = new Random();
                for (int i = 0; i < data1.Length; i++)
                {
                    data1[i][0] = i;
                    data1[i][1] = randNum1.Next(Min, Max);
                }

                timeseries1.Data = data1;

                Random randNum2 = new Random();
                for (int i = 0; i < data2.Length; i++)
                {
                    data2[i][0] = i;
                    data2[i][1] = randNum2.Next(Min, Max) + 5;
                }

                timeseries2.Data = data2;

                //JsonConvert.PopulateObject(json, timeseries3);
                //timeseries3 = JsonConvert.DeserializeObject<TimeSeries>(json);

                var timeseriesArray = new TimeSeries[] {timeseries1, timeseries2};

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
                _context.Measurements.Remove(measurementToRemove);
                await _context.SaveChangesAsync();
                return Ok("Deleted measurement - " + measurementToRemove.Name);
            }
        }
    }

}