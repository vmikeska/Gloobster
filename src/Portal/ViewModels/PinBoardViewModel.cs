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

			var userIdObj = new ObjectId(userId);
			var visited = DB.C<VisitedEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);

			Countries = visited.Countries.Count;
			Cities = visited.Cities.Count;
			WorldTraveled = CalculatePercentOfWorldTraveled(Countries);
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