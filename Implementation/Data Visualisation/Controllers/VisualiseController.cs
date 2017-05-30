using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Data_Visualisation.Controllers
{
    public class VisualiseController : Controller
    {
        
        public IActionResult Plot()
        {
            ViewBag.HeaderTitle = "Plot";
            ViewBag.HeaderSubtitle = "";

            return View();
        }
    }
}
