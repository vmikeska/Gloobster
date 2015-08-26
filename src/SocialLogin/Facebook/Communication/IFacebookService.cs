namespace Gloobster.SocialLogin.Facebook.Communication
{
	public interface IFacebookService
	{
		T Get<T>(string query);

		void SetAccessToken(string accessToken);
	}
}