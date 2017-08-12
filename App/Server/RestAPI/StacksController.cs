using AspCoreServer.Data;
using AspCoreServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AspCoreServer.Controllers
{

    [Route("api/[controller]")]
    public class StacksController : Controller
    {
        private readonly SpaDbContext _context;

        public StacksController(SpaDbContext context)
        {
            _context = context;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Count()
        {
            var stackCount = await _context.Stacks.CountAsync();

            return Ok(stackCount);
        }

        [HttpGet]
        public async Task<IActionResult> Get(int currentPageNo = 1, int pageSize = 1000)
        {
            var stacks = await _context.Stacks
                .Include(s => s.StackCells)
                .OrderByDescending(s => s.Created)
                .Skip((currentPageNo - 1) * pageSize)
                .Take(pageSize)
                .ToArrayAsync();

            if (!stacks.Any())
            {
                return NotFound("Stacks not Found");
            }
            else
            {
                foreach (Stack stack in stacks)
                {
                    stack.CellCount = stack.StackCells.Count;
                    stack.StackCells = null;
                }

                return Ok(stacks);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var stack = await _context.Stacks
                .Where(s => s.Id == id)
                .Include(s => s.StackCells)
                .ThenInclude(x => x.Cell)
                .SingleOrDefaultAsync(m => m.Id == id);

            if (stack == null)
            {
                return NotFound("Stack not Found");
            }
            else
            {
                foreach (StackCell stackCell in stack.StackCells)
                {
                    stackCell.Stack = null;
                    stackCell.StackId = 0;

                    stackCell.Cell.StackCells = null;
                    stackCell.Cell.Measurements = null;
                }

                return Ok(stack);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Stack stack)
        {
            if (!string.IsNullOrEmpty(stack.Name))
            {
                _context.Add(stack);
                await _context.SaveChangesAsync();
                return CreatedAtAction("Post", stack);
            }
            else
            {
                return BadRequest("The Stack's name was not given");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]Stack stackUpdateValue)
        {
            try
            {
                stackUpdateValue.Modified = DateTime.Now.ToUniversalTime();

                var stackToEdit = await _context.Stacks
                  .AsNoTracking()
                  .SingleOrDefaultAsync(m => m.Id == id);

                if (stackToEdit == null)
                {
                    return NotFound("Could not update stack as it was not Found");
                }
                else
                {
                    _context.Update(stackUpdateValue);
                    await _context.SaveChangesAsync();
                    return Ok("Updated stack - " + stackUpdateValue.Name);
                }
            }
            catch (DbUpdateException)
            {
                //Log the error (uncomment ex variable name and write a log.)
                ModelState.AddModelError("", "Unable to save changes. " +
                    "Try again, and if the problem persists, " +
                    "see your system administrator.");
                return NotFound("Stack not Found");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var stackToRemove = await _context.Stacks
                .AsNoTracking()
            .SingleOrDefaultAsync(m => m.Id == id);
            if (stackToRemove == null)
            {
                return NotFound("Could not delete stack as it was not Found");
            }
            else
            {
                _context.Stacks.Remove(stackToRemove);
                await _context.SaveChangesAsync();
                return Ok("Deleted stack - " + stackToRemove.Name);
            }
        }
    }

}