using System.Collections.Generic;
using System.Linq;

namespace Data_Visualisation.Models {

    public class EFRecordRepository : IRecordRepository {
        private ApplicationDbContext context;

        public EFRecordRepository(ApplicationDbContext ctx) {
            context = ctx;
        }

        public IEnumerable<Record> Records => context.Records;

        public void SaveRecord(Record record) {
            if (record.RecordId == 0) {
                context.Records.Add(record);
            } else {
                Record dbEntry = context.Records
                    .FirstOrDefault(p => p.RecordId == record.RecordId);
                if (dbEntry != null) {
                    dbEntry.Name = record.Name;
                    dbEntry.Description = record.Description;
                    dbEntry.Category = record.Category;
                    dbEntry.BinaryData= record.BinaryData;
                    dbEntry.ContentType= record.ContentType;
                    dbEntry.Creation= record.Creation;
                    dbEntry.Modification= record.Modification;
                }
            }
            context.SaveChanges();
        }

        public Record DeleteRecord(int recordID) {
            Record dbEntry = context.Records
                .FirstOrDefault(p => p.RecordId == recordID);
            if (dbEntry != null) {
                context.Records.Remove(dbEntry);
                context.SaveChanges();
            }
            return dbEntry;
        }
    }
}
