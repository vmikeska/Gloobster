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
		public async Task<PortalUserDO> Create(object user)
		{
			var portalUser = (PortalUserDO) user;

			var newUser = new PortalUserEntity
			{
				Mail = portalUser.Mail,
				Password = portalUser.Password,
				DisplayName = portalUser.DisplayName
			};

			var userEntity = await DB.SaveAsync(newUser);
			var result = userEntity.ToDO();
			return result;
		}

		public Task<PortalUserDO> Load(object user)
		{
			throw new NotImplementedException();
		}

		public string GetEmail(object user)
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