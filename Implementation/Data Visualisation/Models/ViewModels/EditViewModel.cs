using System.Collections.Generic;
using Data_Visualisation.Models;

namespace Data_Visualisation.Models.ViewModels
{

    public class EditViewModel
    {
        public string Title { get; set; }
        public Stack Stack { get; set; }
        public bool IsSuccess { get; set; }
        public bool AlertBool { get; set; }
        public string Alert { get; set; }
    }

}