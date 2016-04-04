using System.Collections.Generic;
using Gloobster.Entities;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainModels;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    public class PinBoardViewModel: ViewModelBase
	{				
		public int Cities { get; set; }
		public int Countries { get; set; }
		public int WorldTraveled { get; set; }		
		public int UsStates { get; set; }
        public List<Friend> Friends { get; set; }

        public void InitializeExists(VisitedEntity visited, IEntitiesDemandor demandor)
        {
            Countries = visited.Countries.Count;
            Cities = visited.Cities.Count;
            WorldTraveled = PinBoardUtils.CalculatePercentOfWorldTraveled(Countries);
            UsStates = visited.States.Count;

            var friendsEntity = DB.FOD<FriendsEntity>(f => f.User_id == visited.PortalUser_id);
            var friends = DB.List<UserEntity>(f => friendsEntity.Friends.Contains(f.User_id));
            Friends = friends.Select(f => new Friend
            {
                DisplayName = f.DisplayName,
                Id = f.id.ToString()
            }).ToList();
        }

        //public void InitializeLogged(string userId)
        //{
        //    var userIdObj = new ObjectId(userId);
        //    var visited = DB.C<VisitedEntity>().FirstOrDefault(u => u.PortalUser_id == userIdObj);

        //    Countries = visited.Countries.Count;
        //    Cities = visited.Cities.Count;
        //    WorldTraveled = PinBoardUtils.CalculatePercentOfWorldTraveled(Countries);
        //    UsStates = visited.States.Count;

        //    var friendsEntity = DB.C<FriendsEntity>().FirstOrDefault(f => f.PortalUser_id == userIdObj);
        //    var friends = DB.C<PortalUserEntity>().Where(f => friendsEntity.Friends.Contains(f.id)).ToList();
        //    Friends = friends.Select(f => new Friend
        //    {
        //        DisplayName = f.DisplayName,
        //        Id = f.id.ToString()
        //    }).ToList();
        //}

        public void InitializeNotExists()
        {
            Friends = new List<Friend>();
        }

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