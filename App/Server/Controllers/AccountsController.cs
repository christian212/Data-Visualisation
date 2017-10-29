
using Microsoft.AspNetCore.Mvc;
using AspCoreServer.ViewModels;
using AutoMapper;
using AspCoreServer.Models;
using Microsoft.AspNetCore.Identity;
using AspCoreServer.Helpers;
using System.Threading.Tasks;
using AspCoreServer.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace AspCoreServer.Controllers
{
    [Route("api/[controller]")]
    public class AccountsController : Controller
    {
        private readonly SpaDbContext _appDbContext;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly RoleManager<AppRole> _roleManager;

        public AccountsController(UserManager<AppUser> userManager, IMapper mapper, SpaDbContext appDbContext, IHttpContextAccessor httpContextAccessor, RoleManager<AppRole> roleManager)
        {
            _userManager = userManager;
            _mapper = mapper;
            _appDbContext = appDbContext;
            _httpContextAccessor = httpContextAccessor;
            _roleManager = roleManager;
        }

        // POST api/accounts
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]RegistrationViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            bool x = await _roleManager.RoleExistsAsync(model.Role);
            if (!x)
            {
                // first we create Admin rool    
                var role = new AppRole();
                role.Name = model.Role;
                await _roleManager.CreateAsync(role);
            }

            var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await _userManager.FindByEmailAsync(userId);
            var currentRoles = await _userManager.GetRolesAsync(user);
            // var currentRoles = "Admin";

            if (currentRoles.Contains("Admin"))
            {
                var userIdentity = _mapper.Map<AppUser>(model);

                var result = await _userManager.CreateAsync(userIdentity, model.Password);

                var result1 = await _userManager.AddToRoleAsync(userIdentity, model.Role);

                if (!result.Succeeded) return new BadRequestObjectResult(Errors.AddErrorsToModelState(result, ModelState));

                await _appDbContext.JobSeekers.AddAsync(new JobSeeker { IdentityId = userIdentity.Id.ToString(), Location = model.Location });
                await _appDbContext.SaveChangesAsync();

                return new OkObjectResult("Account created");
            }
            else
            {
                return StatusCode(403);
            }
        }
    }
}