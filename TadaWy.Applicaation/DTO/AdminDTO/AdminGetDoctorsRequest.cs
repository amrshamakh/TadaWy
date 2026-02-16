using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Enums;

namespace TadaWy.Applicaation.DTO.AdminDTO
{
    public class AdminGetDoctorsRequest
    {
        public DoctorStatus? Status { get; set; } 
        public string? Search { get; set; }

        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }

}
