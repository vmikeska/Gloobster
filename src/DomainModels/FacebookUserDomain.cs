using System.Linq;
using System.Threading.Tasks;
using Facebook;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
using Gloobster.DomainModelsCommon.User;
using Gloobster.Mappers;
using Gloobster.SocialLogin.Facebook.Communication;

namespace Gloobster.DomainModels
{
	public class FacebookUserDomain : IFacebookUserDomain
	{
		public IDbOperations DB;
		public IFacebookService FBService;


		public FacebookUserDomain(IDbOperations db, IFacebookService fbService)
		{
			DB = db;
			FBService = fbService;
		}

		public bool LogInFacebookUser(FacebookUserAuthenticationDO facebookUser)
		{
			return true;
		}

		public async Task<FacebookUserExistsDO> FacebookUserExists(string userId)
		{
			var query = $"{{ 'Facebook.FacebookUser.UserId': '{userId}' }}";
			var results = await DB.FindAsync<PortalUserEntity>(query);

			bool exist = (results != null && results.Any());

			var result = new FacebookUserExistsDO
			{
				UserExists = exist
			};

			if (exist)
			{
				result.PortalUser = results.First().ToDO();
			}

			return result;
		}



		public async Task<CreateFacebookUserResultDO> CreateFacebookUser(FacebookUserAuthenticationDO fbUserAuthentication)
		{
			var fbUserExists = await FacebookUserExists(fbUserAuthentication.UserID);
			if (fbUserExists.UserExists)
			{
				return new CreateFacebookUserResultDO {Status = UserCreated.UserExists};
			}

			//todo: check if email exists in the system already

			var userCallResult = FBService.Get<FacebookUserFO>("/me", fbUserAuthentication.AccessToken);
			var resultEntity = userCallResult.ToEntity();

			var userEntity = new PortalUserEntity
			{
				DisplayName = resultEntity.Name,
				Mail = resultEntity.Email,
				Password = GeneratePassword(),
				Facebook = new FacebookGroupEntity
				{
					Authentication = fbUserAuthentication.ToEntity(),
					FacebookUser = resultEntity
				}
			};

			var savedEntity = await DB.SaveAsync(userEntity);

			return new CreateFacebookUserResultDO {Status = UserCreated.Successful, CreatedUser = savedEntity.ToDO()};
		}

		public async Task<UserLoggedResultDO> ValidateFacebookUser(FacebookUserAuthenticationDO fbAuth)
		{
			var result = new UserLoggedResultDO {IsFacebook = true, IsStandardUser = false, RegisteredNewUser = false};

			var fbExistResult = await FacebookUserExists(fbAuth.UserID);

			if (!fbExistResult.UserExists)
			{
				await CreateFacebookUser(fbAuth);
				result.RegisteredNewUser = true;
			}

			//todo: implement some login service
			bool fbLogged = LogInFacebookUser(fbAuth);
			if (fbLogged)
			{
				result.Status = UserLogged.Successful;
			}
			//else
			//{
			//	result.Status = UserLogged.UnknownFailure;
			//}


			ExtractVisitedCountries(fbAuth);


			return result;
		}

		private void ExtractVisitedCountries(FacebookUserAuthenticationDO fbAuth)
		{
			var taggedPlacesQuery = $"/{fbAuth.UserID}/tagged_places";

			//tagged_places'
			var places = FBService.Get<TaggedPlacesFO>(taggedPlacesQuery, fbAuth.AccessToken);
			//<FacebookUserFO>

		}

		private string GeneratePassword()
		{
			//todo: implement
			return "NewPass";
		}

	}

	public class FacebookTaggedPlacesExtractor
	{
		public string AccessToken;
		public IFacebookService FBService;

		public void ExtractAll()
		{
			//extractAllCities(new Array(), '/me/tagged_places', everythingExtracted);
		}

		public void Extract()
		{
			var response = FBService.Get<TaggedPlacesFO>("todoQuery", AccessToken);


			//var currentPlaces = extractCities(response.data);

			//locations = locations.concat(currentPlaces.locations);
			//if (response.paging.next)
			//{
			//	extractAllCities(locations, response.paging.next, onEverythingExtracted);
			//}
			//else
			//{
			//	onEverythingExtracted(locations);
			//}

		}

	}
}