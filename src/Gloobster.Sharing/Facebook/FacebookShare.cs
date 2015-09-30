using System.Collections.Generic;
using Facebook;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.Sharing
{
	public class FacebookShare
	{
		public void Share(FacebookShareOptionsDO sharingOptions, SocAuthenticationDO authentication)
		{
			var endpoint = "/me/feed";
			//og.follows
			
			var client = new FacebookClient(authentication.AccessToken);
			
			var args = new Dictionary<string, object>
			{
				{"message", sharingOptions.Message },
				{"picture", sharingOptions.Picture},
				{"name", sharingOptions.Name}, 
				{"description", sharingOptions.Description},
				{"caption", sharingOptions.Caption},				
				{"link", sharingOptions.Link} 
			};

			//todo: privacy

			client.Post(endpoint, args);
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