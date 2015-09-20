using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gloobster.Common
{
	//public interface IGloobsterConfig
	//{
	//	string MongoConnectionString { get; set; }
	//	string DatabaseName { get; set; }
	//	string AppSecret { get; set; }
	//}

	public static class GloobsterConfig 
		//: IGloobsterConfig
	{
		public static string MongoConnectionString { get; set; }
		public static string DatabaseName { get; set; }
		public static string AppSecret { get; set; }


		public static string FacebookAppId { get; set; }
		public static string FacebookAppSecret { get; set; }

		public static string TwitterConsumerKey { get; set; }
		public static string TwitterConsumerSecret { get; set; }

		public static string TwitterAccessToken { get; set; }
		public static string TwitterAccessTokenSecret { get; set; }

		public static string FoursquareClientId { get; set; }
		public static string FoursquareClientSecret { get; set; }
	}
}
