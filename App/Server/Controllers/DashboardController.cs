
using System.Security.Claims;
using System.Threading.Tasks;
using AspCoreServer.Models;
using AspCoreServer.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace AspNetCore
{

    [Authorize(Policy = "ApiUser")]
    [Route("api/[controller]")]
    public class DashboardController : Controller
    {
        private readonly UserManager<AppUser> _manager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        // Inject UserManager using dependency injection.
        // Works only if you choose "Individual user accounts" during project creation.
        public DashboardController(UserManager<AppUser> manager, IHttpContextAccessor httpContextAccessor)
        {
            _manager = manager;
            _httpContextAccessor = httpContextAccessor;
        }

        // GET api/dashboard/home
        [HttpGet("home")]
        public async Task<IActionResult> GetHomeAsync()
        {

            var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value;
            var user = await _manager.FindByEmailAsync(userId);
            var currentRoles = await _manager.GetRolesAsync(user);

            var userViewModel = new UserViewModel();
            userViewModel.FirstName = user.FirstName;
            userViewModel.LastName = user.LastName;
            userViewModel.Email = user.Email;
            userViewModel.Role = currentRoles[0];

            return new OkObjectResult(userViewModel);
        }
    }
}