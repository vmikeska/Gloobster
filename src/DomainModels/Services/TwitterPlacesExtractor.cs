using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.DomainModelsCommon.DO;
using TweetSharp;

namespace Gloobster.DomainModels.Services
{
    public class TwitterPlacesExtractor
    {

	    public void Extract(TwitterUserAuthenticationDO auth)
	    {
			var twitterSvc = new TwitterService(GloobsterConfig.TwitterConsumerKey, GloobsterConfig.TwitterConsumerSecret);
			twitterSvc.AuthenticateWith(auth.Token, auth.TokenSecret);
			
			var options = new ListTweetsOnUserTimelineOptions
			{
				ExcludeReplies = true,
				Count = 200,
				UserId = auth.TwUserId
			};

			var tweets = twitterSvc.ListTweetsOnUserTimeline(options);


		}
	}
}
