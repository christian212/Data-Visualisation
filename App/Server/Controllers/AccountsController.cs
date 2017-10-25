
using Microsoft.AspNetCore.Mvc;
using AspCoreServer.ViewModels;
using AutoMapper;
using AspCoreServer.Models;
using Microsoft.AspNetCore.Identity;
using AspCoreServer.Helpers;
using System.Threading.Tasks;
using AspCoreServer.Data;
using Microsoft.AspNetCore.Hosting;

namespace AspCoreServer.Controllers
{
    [Route("api/[controller]")]
    public class AccountsController : Controller
    {
        private readonly SpaDbContext _appDbContext;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;

        public AccountsController(UserManager<AppUser> userManager,IMapper mapper,SpaDbContext appDbContext)
        {
            _userManager = userManager;
            _mapper=mapper;
            _appDbContext=appDbContext;
        }

        // POST api/accounts
        [HttpPost]
        public async Task<IActionResult> Post([FromBody]RegistrationViewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdentity=_mapper.Map<AppUser>(model);

            var result = await _userManager.CreateAsync(userIdentity, model.Password);

            if (!result.Succeeded) return new BadRequestObjectResult(Errors.AddErrorsToModelState(result, ModelState));

            await _appDbContext.JobSeekers.AddAsync(new JobSeeker{IdentityId=userIdentity.Id.ToString(), Location=model.Location});
            await _appDbContext.SaveChangesAsync();
            
            return new OkObjectResult("Account created");
        }
    }
}