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
            public string Name { get; set; } = default!;

            public ICollection<PatientAllergy> PatientAllergies { get; set; }
                = new List<PatientAllergy>();
        
    }
}
