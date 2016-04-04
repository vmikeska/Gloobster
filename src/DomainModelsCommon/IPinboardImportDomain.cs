using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces
{
    public interface IPinboardImportDomain
    {
        Task ImportFb(string userId);
    }
}