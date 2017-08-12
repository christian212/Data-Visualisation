namespace AspCoreServer.Models
{

    public class TimeSeries
    {
        public string Name { set; get; }
        public Tooltip Tooltip { set; get; }
        public double[][] Data { set; get; }

        //Setting Default value
        public TimeSeries()
        {
            Name = "Unnamed";
        }
    }

    public class Tooltip
    {
        public string ValueSuffix { set; get; }

        //Setting Default value
        public Tooltip(string valueSuffix)
        {
            ValueSuffix = valueSuffix;
        }
    }

}