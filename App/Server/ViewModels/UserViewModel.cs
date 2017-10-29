
using FluentValidation.Attributes;
using AspCoreServer.ViewModels.Validations;

namespace AspCoreServer.ViewModels 
{
    [Validator(typeof(RegistrationViewModelValidator))]
    public class UserViewModel 
    {
        public string Email { get; set; }
        public string FirstName {get;set;}
        public string LastName {get;set;}    
        public string Role {get;set;}      
    }
}