using System.Collections.Generic;
using Facebook;
using Gloobster.DomainObjects;

namespace Gloobster.Sharing.Facebook
{
	public class FacebookShare
	{
		public void Share(FacebookShareOptionsDO so, SocAuthenticationDO authentication)
		{
			var endpoint = "/me/feed";
			//og.follows
			
			var client = new FacebookClient(authentication.AccessToken);
			
			var args = new Dictionary<string, object>
			{
				{"message", so.Message },
				{"picture", so.Picture},
				{"name", so.Name}, 
				{"description", so.Description},
				{"caption", so.Caption},				
				{"link", so.Link} 
			};
			
			var privacy = BuildPrivacyDict(so);
			args.Add("privacy", privacy);

			client.Post(endpoint, args);
		}
		
		///https://developers.facebook.com/docs/graph-api/reference/v2.5/post 		
		private Dictionary<string, object> BuildPrivacyDict(FacebookShareOptionsDO so)
		{
			var privacy = new Dictionary<string, object>
			{
				{"description", so.Privacy.Description },
				{"value", so.Privacy.Value.ToString()}
			};

			if (so.Privacy.Value == FacebookPrivacyLevel.CUSTOM)
			{
				if (so.Privacy.Friends.HasValue)
				{
					privacy.Add("friends", so.Privacy.Allow.ToString());
				}

				if (!string.IsNullOrEmpty(so.Privacy.Allow))
				{
					privacy.Add("allow", so.Privacy.Allow);
				}

				if (!string.IsNullOrEmpty(so.Privacy.Deny))
				{
					privacy.Add("deny", so.Privacy.Deny);
				}
			}

			return privacy;
		}

	}
	
}


//https://developers.facebook.com/docs/sharing/opengraph/using-actions
//https://developers.facebook.com/docs/sharing/web

//{"message", "Test message" }, //1. caption above the photo				
//{"picture", "http://i.iinfo.cz/images/628/shutterstock-com-narceni-obavy-strach-1.jpg"}, //2. photo
//{"name", "This is caption about the thing"}, //3. title of description
//{"description", "this is description"}, //4. description of the thing				
//{"caption", "this is caption"}, //5. an another caption bellow

//{"link", "http://idnes.cz"} // target link