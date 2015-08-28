using Gloobster.Common.DbEntity;
using Gloobster.DomainModels;
using Microsoft.AspNet.Hosting;
using Microsoft.Framework.Configuration;
using Microsoft.Framework.Runtime;
using System;
using Gloobster.DomainModelsCommon.DO;
using Xunit;

namespace Gloobster.UnitTests
{
	
	public class PortalUserTests: TestBase
	{
		public PortalUserTests()
		{			
			//todo: add instance
			UserDomain = new PortalUserDomain(DBOper, null);			
        }		

		public PortalUserDomain UserDomain { get; set; }		

		[Fact]
		public async void should_create_base_user()
		{
			DBOper.DropCollection<PortalUserEntity>();

			var user = UserCreations.CreatePortalUserDO1();

			var result1 = await UserDomain.CreateUserBase(user);
			Assert.Equal(result1.State, UserCreatedState.Created);

			var result2 = await UserDomain.CreateUserBase(user);
			Assert.Equal(result2.State, UserCreatedState.AlreadyExists);
		}

		//[Fact]
		//public async void should_validate_user()
		//{
		//	DBOper.DropCollection<PortalUserEntity>();

		//	var userEntity1 = await UserCreations.CreatePortalUserEntity1(true);

		//	var user = UserCreations.CreatePortalUserDO1(true);

		//}

	}
}
