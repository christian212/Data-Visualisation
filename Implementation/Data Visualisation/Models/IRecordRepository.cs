using System.Collections.Generic;

namespace Data_Visualisation.Models
{

    public interface IRecordRepository
    {
        IEnumerable<Record> Records { get; }

        void SaveRecord(Record record);

        Record DeleteRecord(int productID);
        
    }
}