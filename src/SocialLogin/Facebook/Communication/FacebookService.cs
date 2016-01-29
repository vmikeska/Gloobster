using System;
using System.Linq;
using Facebook;
using System.Threading.Tasks;

namespace Gloobster.SocialLogin.Facebook.Communication
{
	//retreive permissions
	//https://graph.facebook.com/me/permissions?access_token=CAAYZAZC0M01YIBAJ5v1XtsIUw8hjiKx8ZCwLosGjWvnbbpzZAcn7m92FDUp3VdgOZBoMITxKnynDm4DtL2Li8DY6R7XAaJ2P8zSxtHDV4RIuaCbEihLmIBnbqZBtipQheDHiQZA5PGjLNbkGsZAUSr9Gg7OzTN8DVi5kgxYym3DLE4E9iFoZCmIkx
    
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

	    public object Post(string path, object data)
	    {
	        var response = FbClient.Post(path, data);
	        return response;	        
	    }

		public bool ValidateToken()
		{
			try
			{
				var me = Get("me");
			}
			catch (FacebookOAuthException)
			{
				return false;
			}

			return true;
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

	    public bool HasPermissions(string name)
	    {
            var perms = Get<FacebookPermissionsFO>("/me/permissions");

	        var perm = perms.data.FirstOrDefault(p => p.permission == name);
	        if (perm == null)
	        {
	            return false;
	        }

	        if (perm.status == "granted")
	        {
	            return true;
	        }

	        return false;
	    }
	}

    
}