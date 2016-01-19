using System.Collections.Generic;
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
			WorldTraveled = PinBoardUtils.CalculatePercentOfWorldTraveled(Countries);
		    UsStates = visited.States.Count;            
		}

		

		public int Cities { get; set; }
		public int Countries { get; set; }
		public int WorldTraveled { get; set; }		
		public int UsStates { get; set; }

        public List<Friend> Friends { get; set; }
	}

    public class Friend
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
    }

	public class PinBoardUtils
	{
		public static int CalculatePercentOfWorldTraveled(int countriesVisited)
		{
			float percent = (countriesVisited / 193.0f) * 100;
			return (int)percent;
		}
	}
}