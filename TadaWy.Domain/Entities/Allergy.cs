using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Domain.Entities
{
    public class Allergy
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public Allergy(string name)
        {
            Name = name.Trim().ToLowerInvariant();
        }
    }
}
