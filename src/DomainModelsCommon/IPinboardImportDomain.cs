using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces
{
    public interface IPinboardImportDomain
    {
        Task<bool> ImportFb(string userId);
    }
}