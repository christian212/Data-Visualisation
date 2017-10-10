using System.IO;
using System.Threading.Tasks;
using System.Collections.ObjectModel;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using AspCoreServer.Models;
using AspCoreServer.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;


namespace AspCoreServer.Controllers
{
    [Route("api/[controller]")]
    public class FileController : Controller
    {
        private readonly IHostingEnvironment _environment;
        private readonly SpaDbContext _context;

        public FileController(IHostingEnvironment environment, SpaDbContext context)
        {
            _environment = environment;
            _context = context;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Upload(Ticket ticket)
        {
            //TODO: save the ticket ... get id
            ticket.Id = 1001;

            var uploadsRootFolder = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadsRootFolder))
            {
                Directory.CreateDirectory(uploadsRootFolder);
            }

            var files = Request.Form.Files;
            foreach (var file in files)
            {
                var measurement = new Measurement();

                // Add measurement to get ID from database
                _context.Add(measurement);
                await _context.SaveChangesAsync();

                // Save file to disk
                var directoryPath = Path.Combine(uploadsRootFolder, "Measurements", measurement.Id.ToString());

                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                var filePath = Path.Combine(directoryPath, file.FileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream).ConfigureAwait(false);
                }

                // Set additional information
                measurement.Name = file.FileName;
                measurement.Description = "Diese Messung wurde automatisch durch einen Upload hinzugefügt. Klicken Sie auf Bearbeiten um die Beschreibung und andere Eigenschaften zu ändern.";
                measurement.FileName = file.FileName;
                measurement.FilePath = filePath;
                measurement.FileSize = file.Length;

                // Depricated CSV files
                if (file.FileName.ToLower().EndsWith(".csv"))
                {
                    measurement.MeasurementType = MeasurementType.Zeitreihe;
                }
                else if (file.FileName.ToLower().EndsWith(".json"))
                {
                    var json = System.IO.File.ReadAllText(measurement.FilePath);

                    var jsonFile = new JsonFile();
                    JsonConvert.PopulateObject(json, jsonFile);

                    measurement.MeasurementType = jsonFile.MeasurementType;

                    // Format our new DateTime object to start at the UNIX Epoch
                    System.DateTime dateTime = new System.DateTime(1970, 1, 1, 0, 0, 0, 0).ToUniversalTime();

                    // Add the timestamp (number of seconds since the Epoch) to be converted
                    dateTime = dateTime.AddMilliseconds(jsonFile.Time);
                    
                    measurement.Measured = dateTime;

                    if (jsonFile.BatteryId != 0)
                    {
                        var battery = await _context.Batteries
                            .Where(s => s.Id == jsonFile.BatteryId)
                            .SingleOrDefaultAsync(m => m.Id == jsonFile.BatteryId);

                        measurement.Battery = battery;
                    }
                    else if (jsonFile.StackId != 0)
                    {
                        var stack = await _context.Stacks
                            .Where(s => s.Id == jsonFile.StackId)
                            .SingleOrDefaultAsync(m => m.Id == jsonFile.StackId);

                        measurement.Stack = stack;
                    }
                    else if (jsonFile.CellId != 0)
                    {
                        var cell = await _context.Cells
                            .Where(s => s.Id == jsonFile.CellId)
                            .SingleOrDefaultAsync(m => m.Id == jsonFile.CellId);

                        measurement.Cell = cell;
                    }

                    if (measurement.MeasurementType == MeasurementType.Ortskurve)
                    {
                        var locusFile = new LocusFile();
                        JsonConvert.PopulateObject(json, locusFile);

                        var rawMeasurements = new List<RawMeasurement>();
                        var index = 0;
                        foreach (var rawData in locusFile.RawData)
                        {
                            var rawMeasurement = new RawMeasurement();
                            rawMeasurement.Frequency = rawData.Frequency;
                            rawMeasurement.Index = index;
                            rawMeasurements.Add(rawMeasurement);

                            index++;
                        }

                        measurement.RawMeasurements = rawMeasurements;
                    }
                }
                else
                {
                    measurement.MeasurementType = MeasurementType.Sonstige;
                }

                // Update measurement in database
                _context.Update(measurement);
                await _context.SaveChangesAsync();
            }

            return Created("", ticket);
        }
    }
}