using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Data_Visualisation.Models;

namespace Data_Visualisation.Components
{

    public class NavigationMenuViewComponent : ViewComponent
    {
        private IRecordRepository repository;
        public NavigationMenuViewComponent(IRecordRepository repo)
        {
            repository = repo;
        }
        public IViewComponentResult Invoke()
        {
            ViewBag.Count = repository.Records.Count();
            ViewBag.SelectedCategory = RouteData?.Values["category"];
            return View(repository.Records
            .Select(x => x.Category)
            .Distinct()
            .OrderBy(x => x));
        }
    }
}