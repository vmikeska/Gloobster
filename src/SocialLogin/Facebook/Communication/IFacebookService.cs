using Facebook;

namespace Gloobster.SocialLogin.Facebook.Communication
{
	public interface IFacebookService
	{
		bool ValidateToken();
        FacebookClient FbClient { get; set; }
		T Get<T>(string query);
		object Get(string query);
        void SetAccessToken(string accessToken);
	    bool HasPermissions(string name);
	    object Post(string path, object data);
	    string GetMeId();


	}
}