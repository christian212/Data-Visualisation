using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Data_Visualisation.Controllers
{
    public class DownloadFilesController : Controller
    {
        
        public IActionResult Download()
        {
            ViewBag.HeaderTitle = "Download Files";
            ViewBag.HeaderSubtitle = "";

            return View();
        }
    }
}
