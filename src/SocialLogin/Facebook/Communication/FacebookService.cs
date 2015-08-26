using Facebook;

namespace Gloobster.SocialLogin.Facebook.Communication
{
	public class FacebookService: IFacebookService
	{
		public T Get<T>(string query, string accessToken)
		{			
			FacebookClient fbClient;
			try
			{
				fbClient = new FacebookClient(accessToken);
			}
			catch (FacebookOAuthException)
			{
				//todo: do something somehow
				throw;
			}			

			var result = fbClient.Get<T>(query);
			return result;
		}
	}
}