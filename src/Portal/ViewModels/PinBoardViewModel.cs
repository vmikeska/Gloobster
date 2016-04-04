using System.Collections.Generic;
using Gloobster.Entities;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainInterfaces;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    public class PinBoardViewModel: ViewModelBase
	{				
		public int Cities { get; set; }
		public int Countries { get; set; }
		public int WorldTraveled { get; set; }		
		public int UsStates { get; set; }
        public List<string> CountryCodes { get; set; }
        public List<string> StateCodes { get; set; }
        public List<int> TopCities { get; set; }

        public List<Friend> Friends { get; set; }
        public bool ShowFacebookPermissionsDialog { get; set; }
        

        public async Task InitializeExists(string userId, bool showFbDialog, IPinBoardStats stats)
        {
            var userIdObj = new ObjectId(userId);

            var statRes = await stats.GetStatsAsync(userId);

            Countries = statRes.CountriesCount;
            Cities = statRes.CitiesCount;
            WorldTraveled = statRes.WorldTraveledPercent;
            UsStates = statRes.StatesCount;

            TopCities = new List<int>();
            TopCities.AddRange(statRes.AfricaCities);
            TopCities.AddRange(statRes.AsiaCities);
            TopCities.AddRange(statRes.EuropeCities);
            TopCities.AddRange(statRes.NorthAmericaCities);
            TopCities.AddRange(statRes.SouthAmericaCities);

            StateCodes = statRes.StateCodes;
            CountryCodes = statRes.CountryCodes;

            var friendsEntity = DB.FOD<FriendsEntity>(f => f.User_id == userIdObj);
            var friends = DB.List<UserEntity>(f => friendsEntity.Friends.Contains(f.User_id));
            Friends = friends.Select(f => new Friend
            {
                DisplayName = f.DisplayName,
                Id = f.id.ToString()
            }).ToList();

            ShowFacebookPermissionsDialog = showFbDialog;
        }
        
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
    
}