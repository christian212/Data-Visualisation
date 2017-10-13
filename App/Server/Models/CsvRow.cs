using System;

namespace AspCoreServer.Models
{

    public class CsvRow
    {
        public DateTime Timestamp { get; set; }
        public long UnixTimestamp { get; set; }
        public long RelativeTimeMilliSeconds { get; set; }
        public float Spannung { get; set; }
        public float Strom { get; set; }
        public float Ladung { get; set; }
    }

}