using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Data_Visualisation.Models;
using Data_Visualisation.Models.ViewModels;
using System.Collections.Generic;

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

        public ViewResult Details(int recordId = 1)
        {
            ViewBag.HeaderTitle = "Details";
            ViewBag.HeaderSubtitle = "";

            Record record = repository.Records.FirstOrDefault(p => p.RecordId == recordId);

            return View(record);
        }

        public IActionResult Create() => View("Edit", new Record());

        public FileResult Download(int recordId = 1)
        {
            Record record = repository.Records.FirstOrDefault(p => p.RecordId == recordId);
            return File(record.BinaryData, record.ContentType, record.Name);
        }

        public IActionResult Delete(int recordId)
        {
            Record deletedRecord = repository.DeleteRecord(recordId);
            if (deletedRecord != null)
            {
                ViewBag.Message = $"{deletedRecord.Name} was deleted";
            }
            return RedirectToAction("List");
        }

        public ViewResult Edit(int recordId) =>
                    View(repository.Records
                        .FirstOrDefault(p => p.RecordId == recordId));

        [HttpPost]
        public IActionResult Edit(Record record)
        {
            if (ModelState.IsValid)
            {
                repository.SaveRecord(record);
                ViewBag.Message = $"{record.Name} has been saved";
                return RedirectToAction("List");
            }
            else
            {
                // there is something wrong with the data values
                return View(record);
            }
        }
    }
}