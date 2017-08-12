using AspCoreServer.Data;
using AspCoreServer.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AspCoreServer.Controllers
{

    [Route("api/[controller]")]
    public class CellsController : Controller
    {
        private readonly SpaDbContext _context;
        private readonly IHostingEnvironment _environment;

        public CellsController(IHostingEnvironment environment, SpaDbContext context)
        {
            _context = context;
            _environment = environment;
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
                .Include(s => s.Measurements)
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

                foreach (Cell cell in cells)
                {
                    cell.MeasurementCount = cell.Measurements.Count;
                    cell.Measurements = null;
                }

                return Ok(cells);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var cell = await _context.Cells
                .Where(s => s.Id == id)
                .AsNoTracking()
                .Include(s => s.Measurements)
                .SingleOrDefaultAsync(m => m.Id == id);

            if (cell == null)
            {
                return NotFound("Cell not Found");
            }
            else
            {
                foreach (Measurement measurement in cell.Measurements)
                {
                    measurement.Cell = null;
                }

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
                cellUpdateValue.Modified = DateTime.Now.ToUniversalTime();

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
                var measurementsToRemove = _context.Measurements
                .Where(m => m.Cell.Id == id);

                foreach (Measurement measurementToRemove in measurementsToRemove)
                {
                    var filePath = System.IO.Path.Combine(_environment.WebRootPath,
                    "uploads", "Measurements", measurementToRemove.Id.ToString());

                    if (System.IO.Directory.Exists(filePath))
                    {
                        System.IO.Directory.Delete(filePath, true);
                    }
                }

                _context.Measurements.RemoveRange(measurementsToRemove);
                _context.Cells.Remove(cellToRemove);
                await _context.SaveChangesAsync();

                return Ok("Deleted cell - " + cellToRemove.Name);
            }
        }
    }

}