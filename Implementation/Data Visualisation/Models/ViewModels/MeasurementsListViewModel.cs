using System.Collections.Generic;
using Data_Visualisation.Models;

namespace Data_Visualisation.Models.ViewModels
{

    public class MeasurementsListViewModel
    {
        public IEnumerable<Measurement> Measurements { get; set; }
        public PagingInfo PagingInfo { get; set; }
        public string CurrentCategory { get; set; }
    }

}