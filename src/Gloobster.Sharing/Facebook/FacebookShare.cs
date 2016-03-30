using System;
using System.Collections.Generic;
using Facebook;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.Sharing.Facebook
{	
	public class FacebookShare: IFacebookShare
	{
	    private FacebookPrivacyDO GetDefaultPrivacy()
	    {
	        if (GloobsterConfig.IsLocal)
	        {
	            return new FacebookPrivacyDO
	            {
	                Description = "This is debug, only I can see it",
	                Value = FacebookPrivacyLevel.SELF
	            };
	        }
	        else
	        {
                return new FacebookPrivacyDO
                {
                    Description = "Sharing with Friends",
                    Value = FacebookPrivacyLevel.FRIENDS_OF_FRIENDS
                };
            }            
        }

	    public bool Checkin(FacebookCheckinDO checkin, SocAuthDO authentication)
	    {
	        try
	        {
	            var endpoint = "/me/feed";

	            var client = new FacebookClient(authentication.AccessToken);

	            var args = new Dictionary<string, object>();

	            if (!string.IsNullOrEmpty(checkin.Place))
	            {
	                args.Add("place", checkin.Place);
	            }

	            if (!string.IsNullOrEmpty(checkin.Message))
	            {
	                args.Add("message", checkin.Message);
	            }

	            if (!string.IsNullOrEmpty(checkin.Link))
	            {
	                args.Add("link", checkin.Link);
	            }

	            var p = checkin.Privacy ?? GetDefaultPrivacy();
	            var privacy = BuildPrivacyDict(p);
	            args.Add("privacy", privacy);

	            client.Post(endpoint, args);
	            return true;
	        }
	        catch (Exception exc)
	        {
	            return false;
	        }
	    }


	    public void Share(FacebookShareOptionsDO so, SocAuthDO authentication)
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

            var p = so.Privacy ?? GetDefaultPrivacy();
            var privacy = BuildPrivacyDict(p);
			args.Add("privacy", privacy);

			client.Post(endpoint, args);
		}
		
		///https://developers.facebook.com/docs/graph-api/reference/v2.5/post 		
		private Dictionary<string, object> BuildPrivacyDict(FacebookPrivacyDO priv)
		{
			var privacy = new Dictionary<string, object>
			{
				{"description", priv.Description },
				{"value", priv.Value.ToString()}
			};

			if (priv.Value == FacebookPrivacyLevel.CUSTOM)
			{
				if (priv.Friends.HasValue)
				{
					privacy.Add("friends", priv.Allow);
				}

				if (!string.IsNullOrEmpty(priv.Allow))
				{
					privacy.Add("allow", priv.Allow);
				}

				if (!string.IsNullOrEmpty(priv.Deny))
				{
					privacy.Add("deny", priv.Deny);
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