using System.Collections.Generic;
using Data_Visualisation.Models;

namespace Data_Visualisation.Models.ViewModels
{

    public class CellsListViewModel
    {
        public IEnumerable<Cell> Cells { get; set; }
        public PagingInfo PagingInfo { get; set; }
        public string CurrentCategory { get; set; }
    }

}