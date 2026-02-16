using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TadaWy.Applicaation.IService
{
    public interface IEmailService
    {
        Task SendEmail(string receptor,string subject,string body);
    }
}
