using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces
{
    public interface ITripDomain
    {
        Task<bool> DeleteTripAsync(string tripId, string userId);
    }
}