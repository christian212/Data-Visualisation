using Data_Visualisation.Models;

using Data_Visualisation.Data;

namespace Data_Visualisation.Data
{

    public class StackCell
    {
        public int StackID { get; set; }
        public int CellID { get; set; }

        public Stack Stack { get; set; }
        public Cell Cell { get; set; }
    }

}