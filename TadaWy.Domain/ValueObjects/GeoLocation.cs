using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Domain.ValueObjects
{
    public record GeoLocation(double Latitude, double Longitude)
    {
        public bool IsValid =>
            Latitude is >= -90 and <= 90 &&
            Longitude is >= -180 and <= 180;
    }
}
