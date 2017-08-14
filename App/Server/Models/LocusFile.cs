using System.Numerics;

namespace AspCoreServer.Models
{

    public class LocusFile
    {
        public MeasurementType MeasurementType { get; set; }
        public LocusDate Date { set; get; }
        public string Mode { set; get; }
        public double Current { set; get; }
        public double Charge { set; get; }
        public Spectrum Spectrum { set; get; }
    }

    public class LocusDate
    {
        public int Year { set; get; }
        public int Month { set; get; }
        public int Day { set; get; }
        public int Hour { set; get; }
        public int Minute { set; get; }
        public float Second { set; get; }
    }

    public class Spectrum
    {
        public double[] Frequency { set; get; }
        public Impedance Impedance { set; get; }
    }

    public class Impedance
    {
        public double[][] _ArrayData_ { set; get; }
    }
}