using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Data_Visualisation.Models;
using Data_Visualisation.Models.ViewModels;

namespace Data_Visualisation.Controllers
{
    public class RecordController : Controller
    {
        private IRecordRepository repository;

        // Number of records per page
        public int PageSize = 4;

        public RecordController(IRecordRepository repo)
        {
            repository = repo;
        }

        public ViewResult List(string category, int page = 1)
        {
            ViewBag.HeaderTitle = "Datenbank";
            ViewBag.HeaderSubtitle = "";
            ViewBag.Count = repository.Records.Count();
            ViewBag.TimeseriesCount = repository.Records.Where(e => e.Category == "Timeseries").Count();
            ViewBag.LocusCurveCount = repository.Records.Where(e => e.Category == "Locus Curve").Count();
            ViewBag.OthersCount = repository.Records.Where(e => e.Category != "Locus Curve" & e.Category != "Timeseries").Count();

            return View(new RecordsListViewModel
            {
                // Return PageSize records per page
                Records = repository.Records
                .Where(p => category == null || p.Category == category)
                .OrderBy(p => p.RecordId)
                .Skip((page - 1) * PageSize)
                .Take(PageSize),
                PagingInfo = new PagingInfo
                {
                    CurrentPage = page,
                    ItemsPerPage = PageSize,
                    TotalItems = category == null ?
                    repository.Records.Count() :
                    repository.Records.Where(e =>
                        e.Category == category).Count()
                },
                CurrentCategory = category,
            });
        }

        public ViewResult Detail()
        {
            return View();
        }
    }
}