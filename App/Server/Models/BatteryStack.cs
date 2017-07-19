using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AspCoreServer.Models
{

    public class BatteryStack
    {
        public int BatteryID { get; set; }
        public int StackID { get; set; }

        public Battery Battery { get; set; }
        public Stack Stack { get; set; }
    }

}