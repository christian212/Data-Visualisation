using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

using Data_Visualisation.Data;
using Data_Visualisation.Models;
using Data_Visualisation.Models.ViewModels;

namespace Data_Visualisation.Controllers
{

    public class CellController : Controller
    {
        private ICellRepository Repository;
        private IEnumerable<Cell> Cells;
        // Number of cells per page
        public int CellsPerPage = 4;

        public CellController(ICellRepository repo)
        {
            Repository = repo;
            Cells = Repository.Cells;
        }

        public ViewResult List(string category, int page = 1)
        {
            return View(new CellsListViewModel
            {
                // Return PageSize cells per page
                Cells = Cells.Where(p => category == null || p.Category == category)
                .OrderBy(p => p.CellID)
                .Skip((page - 1) * CellsPerPage)
                .Take(CellsPerPage),
                PagingInfo = new PagingInfo
                {
                    CurrentPage = page,
                    ItemsPerPage = CellsPerPage,
                    TotalItems = category == null ?
                    Repository.Cells.Count() :
                    Repository.Cells.Where(e =>
                        e.Category == category).Count()
                },
                CurrentCategory = category
            });
        }
    }

}