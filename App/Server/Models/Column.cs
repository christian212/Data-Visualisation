using System;

namespace AspCoreServer.Models
{

    public class Row
    {
        public DateTime Timestamp { get; set; }
        public long UnixTimestamp { get; set; }
        public float Spannung { get; set; }
        public float Strom { get; set; }
    }

}