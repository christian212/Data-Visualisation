using System;
using Microsoft.AspNetCore.Mvc;

namespace Data_Visualisation.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            ViewBag.HeaderTitle = "Home";
            ViewBag.HeaderSubtitle = "";
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}