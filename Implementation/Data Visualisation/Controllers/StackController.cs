using System;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;

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
            ListViewModel stackList = new ListViewModel
            {
                // Return PageSize stacks per page
                Stacks = Stacks.OrderBy(p => p.StackID)
                .Skip((page - 1) * StacksPerPage)
                .Take(StacksPerPage),
                PagingInfo = new PagingInfo
                {
                    CurrentPage = page,
                    ItemsPerPage = StacksPerPage,
                    TotalItems = Repository.Stacks.Count()
                },
                CurrentCategory = category
            };

            return View(stackList);
        }

        public IActionResult Create()
        {
            EditViewModel editViewModel = new EditViewModel
            {
                Title = "Neuer Stack",
                Stack = new Stack(),
                Alert = ""
            };

            return View("Edit", editViewModel);
        }

        public ViewResult Details(int stackID = 1)
        {
            DetailsViewModel detailsViewModel = new DetailsViewModel();

            detailsViewModel.Stack = Repository.Stacks.FirstOrDefault(p => p.StackID == stackID);
            detailsViewModel.Title = $"Details Stack {stackID}";

            return View(detailsViewModel);
        }

        public ViewResult Edit(int stackID)
        {
            Stack stack = Repository.Stacks.FirstOrDefault(p => p.StackID == stackID);

            EditViewModel editViewModel = new EditViewModel
            {
                Title = $"Stack {stackID} bearbeiten",
                Stack = stack,
                AlertBool = false
            };

            return View(editViewModel);
        }

        [HttpPost]
        public IActionResult Edit(EditViewModel editViewModel)
        {
            Stack stack = editViewModel.Stack;
            DetailsViewModel detailsViewModel = new DetailsViewModel();

            if (stack.StackID == 0)
            {
                stack.Creation = DateTime.Now;
            }

            stack.Modification = DateTime.Now;

            if (ModelState.IsValid)
            {
                Repository.SaveStack(stack);

                editViewModel.IsSuccess = true;
                editViewModel.AlertBool = true;
                editViewModel.Alert = "Daten wurden gespeichert!";

                //return View("Details", detailsViewModel);
                return View(editViewModel);
            }

            else
            {
                // there is something wrong with the data values
                editViewModel.IsSuccess = false;
                editViewModel.AlertBool = true;
                editViewModel.Alert = "Ein Fehler ist aufgetreten. Die Daten wurden nicht gespeichert!";
            };

            return View(editViewModel);
        }

        public IActionResult Delete(int stackID)
        {
            Stack deletedStack = Repository.DeleteStack(stackID);
            if (deletedStack != null)
            {
                ViewBag.Message = $"{deletedStack.Name} was deleted";
            }

            return RedirectToAction("List");
        }
    }

}