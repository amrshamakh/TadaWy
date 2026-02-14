using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Domain.ValueObjects
{
    
    public record GeoLocation(double? Latitude, double? Longitude)
    {
        
        public bool IsValid =>
            Latitude >= -90 && Latitude <= 90 &&
            Longitude >= -180 && Longitude <= 180;
    }
}
