using System.Numerics;

namespace AspCoreServer.Models
{

    public class JsonFile
    {
        public MeasurementType MeasurementType { get; set; }
        public int BatteryId { get; set; }
        public int StackId { get; set; }
        public int CellId { get; set; }
        public long Time { set; get; }
    }
}