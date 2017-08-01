using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using AspCoreServer.Models;
using AspCoreServer.Data;

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
                //TODO: do security checks ...!

                var measurement = new Measurement();

                if (file == null || file.Length == 0)
                {
                    continue;
                }

                measurement.Name = file.FileName;
                measurement.Description = "Diese Messung wurde automatisch durch einen Upload hinzugefügt. Klicken Sie auf Bearbeiten um die Beschreibung und andere Eigenschaften zu ändern.";
                measurement.FileName = file.FileName;
                measurement.FileSize = file.Length;

                if (file.FileName.ToLower().EndsWith(".csv"))
                {
                    measurement.MeasurementType = MeasurementType.Zeitreihe;
                }
                else if (file.FileName.ToLower().EndsWith(".json"))
                {
                    measurement.MeasurementType = MeasurementType.Ortskurve;
                }
                else
                    measurement.MeasurementType = MeasurementType.Sonstige;

                _context.Add(measurement);
                await _context.SaveChangesAsync();

                var ide = measurement.Id;

                var directoryPath = Path.Combine(uploadsRootFolder, "Measurements", ide.ToString());

                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                var filePath = Path.Combine(directoryPath, file.FileName);

                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream).ConfigureAwait(false);
                }
            }

            return Created("", ticket);
        }
    }
}