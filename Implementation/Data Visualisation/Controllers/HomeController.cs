using System;
using Microsoft.AspNetCore.Mvc;

namespace Data_Visualisation.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        
        public IActionResult Examples()
        {
            int hour = DateTime.Now.Hour;
            ViewBag.greeting = hour < 10 ? "Guten Morgen!" : "Hallo!";
            ViewBag.lastUpdated = DateTime.Now;

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}