using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Applicaation.DTO.AddressDto;

namespace TadaWy.Applicaation.IService
{
    public interface IGeocodingService
    {
            Task<AddressDto?> GetAddressAsync(double latitude, double longitude);
    }
}
