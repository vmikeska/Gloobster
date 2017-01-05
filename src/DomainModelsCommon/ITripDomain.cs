using System.Threading.Tasks;
using MongoDB.Bson;

namespace Gloobster.DomainInterfaces
{
    public interface ITripDomain
    {
        Task<bool> DeleteTripAsync(string tripId, string userId);
        Task<string> CreateNewTrip(string name, string userId, bool isInitial);
    }
}