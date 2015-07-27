using System.Threading.Tasks;

namespace Gloobster.DomainModelsCommon.User
{

    public enum UserCreatedState { AlreadyExists, Created }
    public interface IPortalUserDomain
    {
        Task<UserCreatedResultDO> CreateUserBase(string mail, string password);
        Task<bool> UserExists(string mail);
    }
}
