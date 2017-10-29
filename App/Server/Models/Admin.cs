
namespace AspCoreServer.Models
{
    public class Admin  
    {
        public int Id { get; set; }     
        public string IdentityId { get; set; }   
        public AppUser Identity { get; set; }  // navigation property
        public string Location {get;set;}
    }
}