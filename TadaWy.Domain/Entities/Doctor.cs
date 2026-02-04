using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Domain.Entities
{
    public class Doctor
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Experience { get; set; }
        public bool IsApproved { get; set; }
        public string Specialization { get; set; }
        
        public int rating { get; set; }

    }
}
