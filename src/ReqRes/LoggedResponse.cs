﻿using Gloobster.Enums;

namespace Gloobster.ReqRes
{
    public class LoggedResponse
    {
		public string encodedToken { get; set; }
		public string status { get; set; }
	    public SocialNetworkType networkType { get; set; }
    }
}
