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
        public float Voltage { set; get; }
        public float Current { set; get; }
        public float Capacity { set; get; }
    }
}