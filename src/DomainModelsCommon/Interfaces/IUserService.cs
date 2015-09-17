using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IUserService
	{
		IAccountDriver AccountDriver { get; set; }
        Task<UserLoggedResultDO> Validate(object user);
	}
}