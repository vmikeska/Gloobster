using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Mappers;
using System.Linq;

namespace Gloobster.DomainModels.Services.Accounts
{
    public class AccountDriver: IAccountDriver
	{
		public bool CheckCredintials(object authObject, UserDO portalUser)
		{
			var userRequest = (BaseUserDO)authObject;
		    bool valid = true;
                //(userRequest.Password == portalUser.Password);
			return valid;
		}

		public IComponentContext ComponentContext { get; set; }
		public IDbOperations DB { get; set; }
		public UserDO PortalUser { get; set; }
		public SocialNetworkType NetworkType => SocialNetworkType.Base;
		public SocAuthenticationDO Authentication { get; set; }
		public object UserObj { get; set; }
		private BaseUserDO User => (BaseUserDO)UserObj;


		public async Task<UserDO> Create()
		{			
			var newUser = new UserEntity
			{
				//Mail = User.Mail,
				//Password = User.Password,
				DisplayName = GetInitialDisplayName(User.Mail)
			};

			var userEntity = await DB.SaveAsync(newUser);
			var result = userEntity.ToDO();
			return result;
		}

		private string GetInitialDisplayName(string mail)
		{
			bool isValidEmail = mail.Contains("@");
			if (!isValidEmail)
			{
				return mail;
			}

			var prms = mail.Split('@');
			return prms.First();
		}

		public string GetEmail()
		{
			return User.Mail;
		}

		public void OnUserExists(UserDO portalUser)
		{
			
		}

		public void OnUserSuccessfulyLogged(UserDO portalUser)
		{
			
		}
	}
}