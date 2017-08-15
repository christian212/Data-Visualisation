using System;

namespace AspCoreServer.Models
{

    public class RawMeasurement
    {
        public int Id { get; set; }
        public int Index { get; set; } 
        public double Frequency { get; set; }

        public Measurement Measurement { get; set; }
    }

}