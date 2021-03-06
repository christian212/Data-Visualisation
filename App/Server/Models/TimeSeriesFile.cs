using System.Numerics;

namespace AspCoreServer.Models
{
    public class TimeSeriesFile: JsonFile
    {
        public Row[] Data { set; get; }
    }

    public class Row
    {
        public long Time { set; get; }
        public double Voltage { set; get; }
        public double Current { set; get; }
        public double Capacity { set; get; }
    }
}