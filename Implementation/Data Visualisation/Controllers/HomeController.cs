using Microsoft.AspNetCore.Mvc;

namespace Data_Visualisation.Controllers
{

    public class HomeController : Controller
    {

        public ViewResult Index()
        {
            return View();
        }

        public ViewResult Error()
        {
            return View();
        }

    }

}