namespace AspCoreServer.Models
{

    public class TimeSeries
    {
        public string Name { set; get; }
        public float[][] Data { set; get; }

        //Setting Default value
        public TimeSeries()
        {
            Name = "Unnamed";
        }
    }

}