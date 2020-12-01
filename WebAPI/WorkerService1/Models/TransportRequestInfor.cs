using System;
using System.Collections.Generic;
using System.Text;

namespace WebAPI.Service.Models
{
    public class TransportRequestInfor
    {
        public string RefNo { get; set; }
        public string PlaceFrom { get; set; }
        public string PlaceTo { get; set; }
        public DateTime ExcutionDate { get; set; }
        public string DriverName { get; set; }
        public string LicensePlate { get; set; }
    }
}
