using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces
{
    public interface ITripWaypointsDomain
    {
        Task Generate(string tripId);
    }
}