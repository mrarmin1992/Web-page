using System.Threading.Tasks;
using Core.Entities;

namespace Core.Interfaces
{
    public interface IMailService
    {
        Task SendPasswordResetMailAsync(string email, string callback);
        Task SendWelcomeEmailAsync(Contact contact);
    }
}