using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Common.CommonEnums;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Mappers;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class AccountDriver: IAccountDriver
	{
		public IComponentContext ComponentContext { get; set; }
		public IDbOperations DB { get; set; }
		public PortalUserDO PortalUser { get; set; }
		public SocialNetworkType NetworkType => SocialNetworkType.Base;
		public SocAuthenticationDO Authentication { get; set; }
		public object UserObj { get; set; }
		private BaseUserDO User => (BaseUserDO)UserObj;


		public async Task<PortalUserDO> Create()
		{			
			var newUser = new PortalUserEntity
			{
				Mail = User.Mail,
				Password = User.Password				
			};

			var userEntity = await DB.SaveAsync(newUser);
			var result = userEntity.ToDO();
			return result;
		}

		public string GetEmail()
		{
			return User.Mail;
		}

		public void OnUserExists(PortalUserDO portalUser)
		{
			
		}

		public void OnUserSuccessfulyLogged(PortalUserDO portalUser)
		{
			
		}
	}
}