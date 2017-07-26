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
    public class CellsController : Controller
    {
        private readonly SpaDbContext _context;

        public CellsController(SpaDbContext context)
        {
            _context = context;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Count()
        {
            var cellCount = await _context.Cells.CountAsync();

            return Ok(cellCount);
        }

        [HttpGet]
        public async Task<IActionResult> Get(int currentPageNo = 1, int pageSize = 1000)
        {
            var cells = await _context.Cells
                .OrderByDescending(s => s.Created)
                .Skip((currentPageNo - 1) * pageSize)
                .Take(pageSize)
                .ToArrayAsync();

            if (!cells.Any())
            {
                return NotFound("Cells not Found");
            }
            else
            {
                return Ok(cells);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var cell = await _context.Cells
                .Where(s => s.Id == id)
                .AsNoTracking()
                .SingleOrDefaultAsync(m => m.Id == id);

            if (cell == null)
            {
                return NotFound("Cell not Found");
            }
            else
            {
                return Ok(cell);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Cell cell)
        {
            if (!string.IsNullOrEmpty(cell.Name))
            {
                _context.Add(cell);
                await _context.SaveChangesAsync();
                return CreatedAtAction("Post", cell);
            }
            else
            {
                return BadRequest("The Cell's name was not given");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]Cell cellUpdateValue)
        {
            try
            {
                cellUpdateValue.Modified = DateTime.Now;

                var cellToEdit = await _context.Cells
                  .AsNoTracking()
                  .SingleOrDefaultAsync(m => m.Id == id);

                if (cellToEdit == null)
                {
                    return NotFound("Could not update cell as it was not Found");
                }
                else
                {
                    _context.Update(cellUpdateValue);
                    await _context.SaveChangesAsync();
                    return Ok("Updated cell - " + cellUpdateValue.Name);
                }
            }
            catch (DbUpdateException)
            {
                //Log the error (uncomment ex variable name and write a log.)
                ModelState.AddModelError("", "Unable to save changes. " +
                    "Try again, and if the problem persists, " +
                    "see your system administrator.");
                return NotFound("Cell not Found");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var cellToRemove = await _context.Cells
                .AsNoTracking()
            .SingleOrDefaultAsync(m => m.Id == id);
            if (cellToRemove == null)
            {
                return NotFound("Could not delete cell as it was not Found");
            }
            else
            {
                _context.Cells.Remove(cellToRemove);
                await _context.SaveChangesAsync();
                return Ok("Deleted cell - " + cellToRemove.Name);
            }
        }
    }

}