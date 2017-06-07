using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Collections.Generic;

using Data_Visualisation.Models;
using Data_Visualisation.Data;

namespace Data_Visualisation.Components
{

    public class NavigationMenuViewComponent : ViewComponent
    {
        private IRepository Repository;

        public NavigationMenuViewComponent(
            IRepository repo)
        {
            Repository = repo;
        }

        public IViewComponentResult Invoke()
        {
            IEnumerable<string> distinctCategories = new string[] { "Stacks", "Zellen", "Messungen" };
            int[] badges = new int[3];

            badges[0] = Repository.Stacks.Count();
            badges[1] = Repository.Cells.Count();
            badges[2] = Repository.Measurements.Count();

            ViewBag.Controllers = new string[] { "Stack", "Cell", "Measurement" };
            ViewBag.Badges = badges;
            ViewBag.SelectedCategory = RouteData?.Values["category"];

            return View(distinctCategories);
        }
    }
    
}