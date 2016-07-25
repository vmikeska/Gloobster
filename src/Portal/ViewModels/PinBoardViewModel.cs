using System.Collections.Generic;
using Gloobster.Entities;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.Places;
using Gloobster.Entities.Wiki;
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

        public Dictionary<int, string> GidToTitle { get; set; }

        public List<Friend> Friends { get; set; }
        //public bool ShowFacebookPermissionsDialog { get; set; }

        private Dictionary<int, string> GetGidToTitle()
        {
            var allCities = StatCities.AllCities;
            var dict = new Dictionary<int, string>();

            var cities = DB.List<WikiCityEntity>(c => allCities.Contains(c.GID));
            var cid = cities.Select(c => c.id).ToList();
            var texts = DB.List<WikiTextsEntity>(c => cid.Contains(c.Article_id));

            foreach (var city in cities)
            {
                var text = texts.FirstOrDefault(t => t.Article_id == city.id);
                dict.Add(city.GID, text.LinkName);
            }

            return dict;
        }

        public async Task Initialize(string userId, IPinBoardStats stats)
        {
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
            TopCities.AddRange(statRes.AustraliaCities);

            StateCodes = statRes.StateCodes;
            CountryCodes = statRes.CountryCodes;
            
            Friends = GetFriends(userId);
            
            GidToTitle = GetGidToTitle();
        }

        private List<Friend> GetFriends(string userId)
        {
            var userIdObj = new ObjectId(userId);
        
            var friendsEntity = DB.FOD<FriendsEntity>(f => f.User_id == userIdObj);

            if (friendsEntity == null)
            {
                return new List<Friend>();
            }

            var friends = DB.List<UserEntity>(f => friendsEntity.Friends.Contains(f.User_id));
            var frnds = friends.Select(f => new Friend
            {
                DisplayName = f.DisplayName,
                Id = f.User_id.ToString()
            }).ToList();

            return frnds;
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