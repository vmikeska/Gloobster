using System.Collections.Generic;
using System.IO;
using System.Net;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using TweetSharp;

namespace Gloobster.Sharing.Twitter
{
	
	public class TwitterShare: ITwitterShare
	{
		public IMyTwitterService MyTwitterSvc { get; set; }

		public void Tweet(TwitterShareOptionsDO options, SocAuthDO authentication)
		{
			var service = MyTwitterSvc.GetAuthenticatedService(authentication.AccessToken, authentication.TokenSecret);
			
			using (var imgStream = GetFileStream(options.ImagePath))
			{
				var linkStatus = $"{options.Status} {options.Link}";

				var tweetOptions = new SendTweetWithMediaOptions
				{
					Status = linkStatus,
					Images = new Dictionary<string, Stream> {{"pic", imgStream } },					
				};

				var tweet = service.SendTweetWithMedia(tweetOptions);
				
			}
		}

		public static void CopyStream(Stream input, Stream output)
		{
			byte[] buffer = new byte[32768];
			while (true)
			{
				int read = input.Read(buffer, 0, buffer.Length);
				if (read <= 0)
					return;
				output.Write(buffer, 0, read);
			}
		}

		private MemoryStream GetFileStream(string link)
		{
			var client = new WebClient();
			Stream stream = client.OpenRead(link);

			var memoryStream = new MemoryStream();
			using (stream)
			{
				stream.CopyTo(memoryStream);
			}
			memoryStream.Position = 0;
			
			return memoryStream;
		}

		//ImagePath = @"C:\Users\vmike_000\Pictures\ws_Blue_Docks_1920x1080.jpg",
		//Status = "This is my status",
		//Link = "http://idnes.cz"
	}
}