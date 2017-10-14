using System;

namespace AspCoreServer.Models
{

    public class CsvRow
    {
        public DateTime Timestamp { get; set; }
        public long UnixTimestamp { get; set; }
        public double RelativeTime { get; set; }
        public double Voltage { get; set; }
        public double Current { get; set; }
        public double Charge { get; set; }
    }

}