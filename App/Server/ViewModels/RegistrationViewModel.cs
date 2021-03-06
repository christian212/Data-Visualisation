
using FluentValidation.Attributes;
using AspCoreServer.ViewModels.Validations;

namespace AspCoreServer.ViewModels 
{
    [Validator(typeof(RegistrationViewModelValidator))]
    public class RegistrationViewModel 
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName {get;set;}
        public string LastName {get;set;}
        public string Role { get; set; } 
        public string Location { get; set; }           
    }
}