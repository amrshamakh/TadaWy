using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TadaWy.Domain.Enums;

namespace TadaWy.Domain.Entities
{
    public class Payment
    {
        public int Id { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaymentDate { get; set; }
        public PaymentStatus Status { get; set; }

        public int AppointmentId { get; set; }
        public Appointment Appointment { get; set; }

    }
}
