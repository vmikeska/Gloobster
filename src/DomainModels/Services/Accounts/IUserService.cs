using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModels.Services.Accounts
{
	public interface IUserService
	{
		IAccountDriver AccountDriver { get; set; }
        Task<UserLoggedResultDO> Validate(object user);
	}
}