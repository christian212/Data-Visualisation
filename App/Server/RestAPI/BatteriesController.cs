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
    public class BatteriesController : Controller
    {
        private readonly SpaDbContext _context;
        private readonly IHostingEnvironment _environment;

        public BatteriesController(IHostingEnvironment environment, SpaDbContext context)
        {
            _context = context;
            _environment = environment;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Count()
        {
            var batteryCount = await _context.Batteries.CountAsync();

            return Ok(batteryCount);
        }

        [HttpGet]
        public async Task<IActionResult> Get(int currentPageNo = 1, int pageSize = 1000)
        {
            var batteries = await _context.Batteries
                .OrderByDescending(s => s.Created)
                .Skip((currentPageNo - 1) * pageSize)
                .Take(pageSize)
                .ToArrayAsync();

            if (!batteries.Any())
            {
                return NotFound("Batteries not Found");
            }
            else
            {
                return Ok(batteries);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var battery = await _context.Batteries
                .Where(s => s.Id == id)
                .Include(s => s.Measurements)
                .Include(s => s.BatteryStacks)
                .ThenInclude(x => x.Stack)
                .AsNoTracking()
                .SingleOrDefaultAsync(m => m.Id == id);

            if (battery == null)
            {
                return NotFound("Battery not Found");
            }
            else
            {
                foreach (BatteryStack batteryStack in battery.BatteryStacks)
                {
                    batteryStack.Battery = null;
                    batteryStack.BatteryId = 0;

                    batteryStack.Stack.BatteryStacks = null;
                    batteryStack.Stack.Measurements = null;
                }

                foreach (Measurement measurement in battery.Measurements)
                {
                    measurement.Battery = null;
                    measurement.Stack = null;
                    measurement.Cell = null;
                }

                if (battery.BatteryStacks.Count() == 0){
                    battery.BatteryStacks = null;
                }

                return Ok(battery);
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody]Battery battery)
        {
            if (!string.IsNullOrEmpty(battery.Name))
            {
                _context.Add(battery);
                await _context.SaveChangesAsync();
                return CreatedAtAction("Post", battery);
            }
            else
            {
                return BadRequest("The Battery's name was not given");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(int id, [FromBody]Battery batteryUpdateValue)
        {
            try
            {
                batteryUpdateValue.Modified = DateTime.Now.ToUniversalTime();

                var batteryToEdit = await _context.Batteries
                  .AsNoTracking()
                  .SingleOrDefaultAsync(m => m.Id == id);

                if (batteryToEdit == null)
                {
                    return NotFound("Could not update battery as it was not Found");
                }
                else
                {
                    _context.Update(batteryUpdateValue);
                    await _context.SaveChangesAsync();
                    return Ok("Updated battery - " + batteryUpdateValue.Name);
                }
            }
            catch (DbUpdateException)
            {
                //Log the error (uncomment ex variable name and write a log.)
                ModelState.AddModelError("", "Unable to save changes. " +
                    "Try again, and if the problem persists, " +
                    "see your battery administrator.");
                return NotFound("Battery not Found");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var batteryToRemove = await _context.Batteries
                .AsNoTracking()
            .SingleOrDefaultAsync(m => m.Id == id);
            if (batteryToRemove == null)
            {
                return NotFound("Could not delete battery as it was not Found");
            }
            else
            {
                var measurementsToRemove = _context.Measurements
                .Where(m => m.Battery.Id == id);

                foreach (Measurement measurementToRemove in measurementsToRemove)
                {
                    if (System.IO.Directory.Exists(measurementToRemove.FilePath))
                    {
                        System.IO.Directory.Delete(measurementToRemove.FilePath, true);
                    }
                }

                _context.Batteries.Remove(batteryToRemove);
                await _context.SaveChangesAsync();
                return Ok("Deleted battery - " + batteryToRemove.Name);
            }
        }
    }

}