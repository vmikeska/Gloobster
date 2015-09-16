using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IFacebookDomain
	{
		void UpdateVisitedPlaces(string fbUserId, string dbUserId, string accessToken);
    }
}