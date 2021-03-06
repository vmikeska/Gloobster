﻿using System;
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

        public static string Domain { get; set; }
        public static bool IsLocal { get; set; }
        public static string Protocol { get; set; }
        public static bool UseMiniScripts { get; set; }

        public static string FacebookAppId { get; set; }
		public static string FacebookAppSecret { get; set; }

		public static string TwitterConsumerKey { get; set; }
		public static string TwitterConsumerSecret { get; set; }

		public static string TwitterAccessToken { get; set; }
		public static string TwitterAccessTokenSecret { get; set; }

		public static string FoursquareClientId { get; set; }
		public static string FoursquareClientSecret { get; set; }
    
        public static string YelpAccessToken { get; set; }
        public static string YelpAccessTokenSecret { get; set; }
        public static string YelpConsumerKey { get; set; }
        public static string YelpConsumerSecret { get; set; }

        public static string GoogleClientId { get; set; }
        

        public static string MapBoxSecret { get; set; }
		

		public static string StorageConnectionString { get; set; }
		public static string StorageRootDir { get; set; }
	}
}
