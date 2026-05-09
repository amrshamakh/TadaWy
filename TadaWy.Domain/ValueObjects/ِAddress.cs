using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Domain.ValueObjects
{
    public record Address(
        string Street,
        string City,
        string State,
        string? StreetAr = null,
        string? CityAr = null,
        string? StateAr = null
    );
}
