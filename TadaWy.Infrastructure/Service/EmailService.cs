using Microsoft.Extensions.Configuration;
using System.Net.Mail;
using System.Net;
using TadaWy.Applicaation.IService;

public class EmailService:IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmail(string receptor, string subject, string body)
    {
        var email = _configuration.GetValue<string>("EMAIL_CONFIGURATION:EMAIL");
        var password = _configuration.GetValue<string>("EMAIL_CONFIGURATION:PASSWORD");
        var host = _configuration.GetValue<string>("EMAIL_CONFIGURATION:HOST");
        var port = _configuration.GetValue<int>("EMAIL_CONFIGURATION:PORT");

        using var smtpClient = new SmtpClient(host, port)
        {
            EnableSsl = true,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(email, password)
        };

        using var message = new MailMessage(email, receptor, subject, body);

        try
        {
            await smtpClient.SendMailAsync(message);
        }
        catch (Exception ex)
        {
           
            throw new InvalidOperationException("Failed to send email.", ex);
        }
    }
}
