using System.Collections.Generic;
using System.IO;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using TweetSharp;

namespace Gloobster.Sharing.Twitter
{
	public class TwitterShare
	{
		public IMyTwitterService MyTwitterSvc { get; set; }

		public void Tweet(TwitterShareOptionsDO options, SocAuthenticationDO authentication)
		{
			var service = MyTwitterSvc.GetAuthenticatedService(authentication.AccessToken, authentication.TokenSecret);
			
			using (var stream = new FileStream(options.ImagePath, FileMode.Open))
			{
				var linkStatus = $"{options.Link} {options.Status}";

				var tweetOptions = new SendTweetWithMediaOptions
				{
					Status = linkStatus,
					Images = new Dictionary<string, Stream> {{"pic", stream}},					
				};

				var tweet = service.SendTweetWithMedia(tweetOptions);
				
			}
		}

		//ImagePath = @"C:\Users\vmike_000\Pictures\ws_Blue_Docks_1920x1080.jpg",
		//Status = "This is my status",
		//Link = "http://idnes.cz"
	}
}