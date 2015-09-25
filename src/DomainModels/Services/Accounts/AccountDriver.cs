using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Common;
using Gloobster.Common.DbEntity;
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
		public object UserObj { get; set; }
		private PortalUserDO User => (PortalUserDO)UserObj;


		public async Task<PortalUserDO> Create()
		{			
			var newUser = new PortalUserEntity
			{
				Mail = User.Mail,
				Password = User.Password,
				DisplayName = User.DisplayName
			};

			var userEntity = await DB.SaveAsync(newUser);
			var result = userEntity.ToDO();
			return result;
		}

		public Task<PortalUserDO> Load()
		{
			throw new NotImplementedException();
		}

		public string GetEmail()
		{
			throw new NotImplementedException();
		}

		public void OnUserExists(PortalUserDO portalUser)
		{
			throw new NotImplementedException();
		}

		public void OnUserSuccessfulyLogged(PortalUserDO portalUser)
		{
			throw new NotImplementedException();
		}
	}
}