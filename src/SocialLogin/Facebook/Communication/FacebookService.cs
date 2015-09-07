using Facebook;

namespace Gloobster.SocialLogin.Facebook.Communication
{
	public class FacebookService: IFacebookService
	{

		public string AccessToken { get; set; }
		public FacebookClient FbClient { get; set; }

		public T Get<T>(string query)
		{	
			var result = FbClient.Get<T>(query);
			return result;
		}
		public object Get(string query)
		{
			var result = FbClient.Get(query);
			return result;
		}
		
		public void SetAccessToken(string accessToken)
		{
			AccessToken = accessToken;

			try
			{
				FbClient = new FacebookClient(AccessToken);
			}
			catch (FacebookOAuthException)
			{
				//todo: do something somehow
				throw;
			}
		}
	}
}