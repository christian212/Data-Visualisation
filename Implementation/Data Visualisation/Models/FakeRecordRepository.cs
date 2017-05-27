using System.Collections.Generic;

namespace Data_Visualisation.Models {

    public class FakeRecordRepository : IRecordRepository {

        public IEnumerable<Record> Records => new List<Record> {
            new Record { Name = "Messung 1", Category = "Timeseries" },
            new Record { Name = "Messung 2", Category = "Locus Curve" },
            new Record { Name = "Messung 3", Category = "Timeseries" }
        };
    }
}