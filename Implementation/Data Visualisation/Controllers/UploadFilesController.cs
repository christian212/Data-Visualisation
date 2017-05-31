using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Data_Visualisation.Models;

namespace Data_Visualisation.Controllers
{
    public class UploadFilesController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        private IRecordRepository repository;

        public UploadFilesController(IHostingEnvironment environment, IRecordRepository repo)
        {
            _hostingEnvironment = environment;
            repository = repo;
        }

        #region snippet1
        [HttpPost("UploadFiles")]
        public async Task<IActionResult> Post(List<IFormFile> files)
        {
            // size of all uploaded files
            long size = files.Sum(f => f.Length);

            // full path to uploads folder
            var uploads = Path.Combine(_hostingEnvironment.WebRootPath, "uploads");

            foreach (var formFile in files)
            {
                if (formFile.Length > 0)
                {
                    var filePath = Path.Combine(uploads, formFile.FileName);

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        // Save file to file system
                        await formFile.CopyToAsync(fileStream);

                        // Save binary data to database
                        using (var memoryStream = new MemoryStream())
                        {
                            await formFile.CopyToAsync(memoryStream);

                            Record rec = new Record();
                            rec.BinaryData = memoryStream.ToArray();
                            rec.Name = formFile.FileName;
                            rec.Category = "Sonstige";

                            FileInfo fileInfo = new FileInfo(uploads);
                            rec.Creation = fileInfo.CreationTime;
                            rec.Modification = fileInfo.LastWriteTime;
                            rec.ContentType = formFile.ContentType;

                            rec.Description = "Dies ist eine Beschreibung.";

                            repository.SaveRecord(rec);
                        }
                    }
                }
            }
            return RedirectToAction("List", "Record");
        }
        #endregion

        public IActionResult Upload()
        {
            ViewBag.HeaderTitle = "Upload Files";
            ViewBag.HeaderSubtitle = "";

            return View();
        }
    }
}