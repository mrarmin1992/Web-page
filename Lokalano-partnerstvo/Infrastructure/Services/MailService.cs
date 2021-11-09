using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services
{
    public class MailService : IMailService
    {
        private readonly string mailFrom;
        private readonly string mailFromPassword;
        private readonly string mailTo;

        public MailService(IConfiguration config)
        {
            mailFrom = config.GetSection("Mail:mailFrom").Value;
            mailFromPassword = config.GetSection("Mail:fromPassword").Value;
            mailTo = config.GetSection("Mail:mailTo").Value;
        }

        public async Task SendPasswordResetMailAsync(string email, string callback)
        {
            string FilePath = Directory.GetCurrentDirectory() + "\\Templates\\PasswordReset.html";
            StreamReader str = new StreamReader(FilePath);
            string MailText = str.ReadToEnd();
            str.Close();
            MailText = MailText.Replace("[link]", callback);
            var fromAddress = new MailAddress(mailFrom, "Lokalno partnerstvo za obrazovanje odraslih");
            var toAddress = new MailAddress(email, "");
            var subject = "Resetovanje lozinke";
            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(mailFrom, mailFromPassword)
            };
            var mail = new MailMessage(fromAddress, toAddress);
            mail.IsBodyHtml = true;
            mail.Subject = subject;
            mail.Body = MailText;
            await smtp.SendMailAsync(mail);
        }

        public async Task SendWelcomeEmailAsync(Contact contact)
        {
            string FilePath = Directory.GetCurrentDirectory() + "\\Templates\\Contact.html";
            StreamReader str = new StreamReader(FilePath);
            string MailText = str.ReadToEnd();
            str.Close();
            MailText = MailText.Replace("[ImePrezime]", contact.Name).Replace("[Email]", contact.Mail).Replace("[Poruka]", contact.Message);
            var fromAddress = new MailAddress(mailFrom, "Lokalno partnerstvo za obrazovanje odraslih");
            var toAddress = new MailAddress(mailTo, "Poštovani");
            string fromPassword = mailFromPassword;
            const string subject = "Pitanje";
            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            var message = new MailMessage(fromAddress, toAddress);
            message.IsBodyHtml = true;
            message.Subject = subject;
            message.Body = MailText;
            await smtp.SendMailAsync(message);
        }
    }
}