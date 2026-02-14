using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Domain.Entities
{
    public class Specialization
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public List<Doctor>? Doctors { get; set; } = new List<Doctor>();
        public Specialization(string name)
        {
            Name = name.Trim().ToLowerInvariant();
        }
    }
}
