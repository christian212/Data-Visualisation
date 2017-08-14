using System.Collections.Generic;

namespace AspCoreServer.Models
{

    public class Locus
    {
        public string Name { set; get; }
        public IList<ComplexPoint> Data { set; get; }

        //Setting Default value
        public Locus()
        {
            Name = "Unnamed";
        }
    }

    public class ComplexPoint
    {
        public double X { set; get; }
        public double Y { set; get; }
        public double Frequency { set; get; }

        public ComplexPoint(double x, double y)
        {
            X = x;
            Y = y;
        }
    }
}