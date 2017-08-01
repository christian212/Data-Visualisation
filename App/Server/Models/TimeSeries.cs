namespace AspCoreServer.Models
{

    public class TimeSeries
    {
        public string Name { set; get; }
        public double[][] Data { set; get; }

        //Setting Default value
        public TimeSeries()
        {
            Name = "Unnamed";
        }
    }

}