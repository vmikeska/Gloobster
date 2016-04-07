using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces
{
    public interface IInitialWikiDataCreator
    {
        Task CreateInitialData();
    }
}