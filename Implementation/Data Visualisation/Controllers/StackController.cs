using System;
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
            return View(new ListViewModel
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
            });
        }

        public IActionResult Create()
        {
            Stack stack = new Stack();

            ViewBag.Title = "Neuer Stack";

            return View("Edit", stack);
        }

        public ViewResult Details(int stackID = 1)
        {
            Stack stack = Repository.Stacks.FirstOrDefault(p => p.StackID == stackID);

            ViewBag.Message = "Test";

            return View(stack);
        }

        public ViewResult Edit(int stackID)
        {
            Stack stack = Repository.Stacks.FirstOrDefault(p => p.StackID == stackID);

            ViewBag.Title = "Stack bearbeiten";

            return View(stack);
        }

        [HttpPost]
        public IActionResult Edit(Stack stack)
        {
            if (stack.StackID == 0)
            {
                stack.Creation = DateTime.Now;
            }

            stack.Modification = DateTime.Now;

            if (ModelState.IsValid)
            {
                Repository.SaveStack(stack);

                string message = $"{stack.Name} wurde gespeichert!";

                return RedirectToAction("Details", new { stackID = stack.StackID });
            }

            else
            {
                // there is something wrong with the data values
                return View(stack);
            }
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