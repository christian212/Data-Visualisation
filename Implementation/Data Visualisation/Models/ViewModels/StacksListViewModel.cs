using System.Collections.Generic;
using Data_Visualisation.Models;

namespace Data_Visualisation.Models.ViewModels
{

    public class StacksListViewModel
    {
        public IEnumerable<Stack> Stacks { get; set; }
        public PagingInfo PagingInfo { get; set; }
        public string CurrentCategory { get; set; }
    }

}