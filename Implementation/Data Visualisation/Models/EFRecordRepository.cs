using System.Collections.Generic;

namespace Data_Visualisation.Models {

    public class EFRecordRepository : IRecordRepository {
        private ApplicationDbContext context;

        public EFRecordRepository(ApplicationDbContext ctx) {
            context = ctx;
        }

        public IEnumerable<Record> Records => context.Records;
    }
}
