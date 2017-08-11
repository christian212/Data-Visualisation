using System;

namespace AspCoreServer.Models
{

    public class Record
    {
        public int Tag { get; set; }
        public int Monat { get; set; }
        public int Jahr { get; set; }
        public int Stunde { get; set; }
        public int Minute { get; set; }
        public int Sekunde { get; set; }
        public float Spannung { get; set; }
        public float Strom { get; set; }
    }

}