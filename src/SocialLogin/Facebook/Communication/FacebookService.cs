using Facebook;

namespace Gloobster.SocialLogin.Facebook.Communication
{
	public class FacebookService: IFacebookService
	{
		public string AccessToken { get; set; }

		public T Get<T>(string query)
		{			
			FacebookClient fbClient;
			try
			{
				fbClient = new FacebookClient(AccessToken);
			}
			catch (FacebookOAuthException)
			{
				//todo: do something somehow
				throw;
			}			

			var result = fbClient.Get<T>(query);
			return result;
		}

		public void SetAccessToken(string accessToken)
		{
			AccessToken = accessToken;
		}
	}
}