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
using Microsoft.AspNetCore.Authorization;

namespace AspCoreServer.Controllers
{
    [Authorize(Policy = "ApiUser")]
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

                    if (jsonFile.Name != null)
                    {
                        measurement.Name = jsonFile.Name;
                    }
                    if (jsonFile.Description != null)
                    {
                        measurement.Description = jsonFile.Description;
                    }

                    // Format our new DateTime object to start at the UNIX Epoch
                    System.DateTime dateTime = new System.DateTime(1970, 1, 1, 0, 0, 0, 0).ToUniversalTime();

                    // Add the timestamp (number of seconds since the Epoch) to be converted
                    measurement.Measured = dateTime.AddMilliseconds(jsonFile.Time);

                    if (jsonFile.BatteryId != 0)
                    {
                        var battery = await _context.Batteries
                            .Where(s => s.Id == jsonFile.BatteryId)
                            .SingleOrDefaultAsync(m => m.Id == jsonFile.BatteryId);

                        if (battery == null)
                        {
                            var newBattery = new Battery();
                            newBattery.Id = jsonFile.BatteryId;
                            _context.Add(newBattery);
                            await _context.SaveChangesAsync();

                            battery = await _context.Batteries
                            .Where(s => s.Id == jsonFile.BatteryId)
                            .SingleOrDefaultAsync(m => m.Id == jsonFile.BatteryId);
                        }

                        measurement.Battery = battery;
                    }
                    else if (jsonFile.StackId != 0)
                    {
                        var stack = await _context.Stacks
                            .Where(s => s.Id == jsonFile.StackId)
                            .SingleOrDefaultAsync(m => m.Id == jsonFile.StackId);

                        if (stack == null)
                        {
                            var newStack = new Stack();
                            newStack.Id = jsonFile.StackId;
                            _context.Add(newStack);
                            await _context.SaveChangesAsync();

                            stack = await _context.Stacks
                            .Where(s => s.Id == jsonFile.StackId)
                            .SingleOrDefaultAsync(m => m.Id == jsonFile.StackId);
                        }

                        measurement.Stack = stack;
                    }
                    else if (jsonFile.CellId != 0)
                    {
                        var cell = await _context.Cells
                            .Where(s => s.Id == jsonFile.CellId)
                            .SingleOrDefaultAsync(m => m.Id == jsonFile.CellId);

                        if (cell == null)
                        {
                            var newCell = new Cell();
                            newCell.Id = jsonFile.CellId;
                            _context.Add(newCell);
                            await _context.SaveChangesAsync();

                            cell = await _context.Cells
                            .Where(s => s.Id == jsonFile.CellId)
                            .SingleOrDefaultAsync(m => m.Id == jsonFile.CellId);
                        }

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
                            rawMeasurement.Frequency = System.Math.Round(rawData.Frequency, 2);
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

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var measurement = await _context.Measurements
                .Where(s => s.Id == id)
                .AsNoTracking()
                .SingleOrDefaultAsync(m => m.Id == id);

            if (measurement == null)
            {
                return NotFound("Measurement File not Found");
            }
            else
            {
                using (FileStream file = new FileStream(measurement.FilePath, FileMode.Open, FileAccess.Read))
                {
                    byte[] bytes = new byte[file.Length];
                    file.Read(bytes, 0, (int)file.Length);
                    var response = File(bytes, "application/octet-stream");
                    return response;
                }
            }
        }
    }
}