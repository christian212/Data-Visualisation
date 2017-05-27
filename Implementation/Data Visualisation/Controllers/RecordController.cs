using System;
using Microsoft.AspNetCore.Mvc;
using Data_Visualisation.Models;

namespace Data_Visualisation.Controllers
{
    public class RecordController : Controller
    {
        private IRecordRepository repository;

        public RecordController(IRecordRepository repo)
        {
            repository = repo;
        }

        public ViewResult List() => View(repository.Records);

    }
}