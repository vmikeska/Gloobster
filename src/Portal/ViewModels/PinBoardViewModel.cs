using System.Threading.Tasks;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using System.Linq;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
	public class PinBoardViewModel: ViewModelBase
	{
		
		public void Initialize(string userId)
		{
			bool isUserLogged = !string.IsNullOrEmpty(userId);
			if (!isUserLogged)
			{
				return;
			}
			
			Countries = CalculateCountries(userId);
			Cities = CalculatePlaces(userId);
			WorldTraveled = CalculatePercentOfWorldTraveled(Countries);
		}


		private int CalculateCountries(string userId)
		{
			int count = DB.C<VisitedCountryEntity>().Count(v => v.PortalUser_id == new ObjectId(userId));			
			return count;			
		}

		private int CalculatePlaces(string userId)
		{
			int count = DB.C<VisitedPlaceEntity>().Count(v => v.PortalUser_id == new ObjectId(userId));			
			return count;
		}

		private int CalculatePercentOfWorldTraveled(int countriesVisited)
		{
			float percent = (countriesVisited/193.0f) * 100;
			return (int) percent;
		}

		public int Cities { get; set; }
		public int Countries { get; set; }
		public int WorldTraveled { get; set; }
		public int Badges { get; set; }
		public int TotalDistanceTraveled { get; set; }
	}
}