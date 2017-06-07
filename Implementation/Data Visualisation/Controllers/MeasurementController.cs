using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;

using Data_Visualisation.Data;
using Data_Visualisation.Models;
using Data_Visualisation.Models.ViewModels;

namespace Data_Visualisation.Controllers
{

    public class MeasurementController : Controller
    {
        private IRepository Repository;
        private IEnumerable<Measurement> Measurements;
        // Number of measurements per page
        public int MeasurementsPerPage = 4;

        public MeasurementController(IRepository repo)
        {
            Repository = repo;
            Measurements = Repository.Measurements;
        }

        public ViewResult List(string category, int page = 1)
        {
            return View(new MeasurementsListViewModel
            {
                // Return PageSize measurements per page
                Measurements = Measurements.Where(p => category == null || p.Category == category)
                .OrderBy(p => p.MeasurementID)
                .Skip((page - 1) * MeasurementsPerPage)
                .Take(MeasurementsPerPage),
                PagingInfo = new PagingInfo
                {
                    CurrentPage = page,
                    ItemsPerPage = MeasurementsPerPage,
                    TotalItems = category == null ?
                    Repository.Measurements.Count() :
                    Repository.Measurements.Where(e =>
                        e.Category == category).Count()
                },
                CurrentCategory = category
            });
        }
    }

}