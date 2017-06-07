using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

using Data_Visualisation.Data;
using Data_Visualisation.Models;
using Data_Visualisation.Models.ViewModels;

namespace Data_Visualisation.Controllers
{

    public class StackController : Controller
    {
        private IRepository Repository;
        private IEnumerable<Stack> Stacks;
        // Number of stacks per page
        public int StacksPerPage = 4;

        public StackController(IRepository repo)
        {
            Repository = repo;
            Stacks = Repository.Stacks;
        }

        public ViewResult List(string category, int page = 1)
        {
            return View(new StacksListViewModel
            {
                // Return PageSize stacks per page
                Stacks = Stacks.Where(p => category == null || p.Category == category)
                .OrderBy(p => p.StackID)
                .Skip((page - 1) * StacksPerPage)
                .Take(StacksPerPage),
                PagingInfo = new PagingInfo
                {
                    CurrentPage = page,
                    ItemsPerPage = StacksPerPage,
                    TotalItems = category == null ?
                    Repository.Stacks.Count() :
                    Repository.Stacks.Where(e =>
                        e.Category == category).Count()
                },
                CurrentCategory = category
            });
        }
    }

}