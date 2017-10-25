using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace AspCoreServer.Models
{
    // Add profile data for application users by adding properties to this class
    public class AppUser : IdentityUser<int>
    {
        // Extended Properties
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    public class AppRole : IdentityRole<int>
    {
    }
}
