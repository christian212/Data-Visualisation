using System.Collections.Generic;

namespace Data_Visualisation.Models
{

    public interface IRecordRepository
    {
        IEnumerable<Record> Records { get; }
        
    }
}