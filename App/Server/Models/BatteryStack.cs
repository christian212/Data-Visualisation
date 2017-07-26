using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AspCoreServer.Models
{

    public class BatteryStack
    {
        public int BatteryId { get; set; }
        public int StackId { get; set; }

        public Battery Battery { get; set; }
        public Stack Stack { get; set; }
    }

}