﻿using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Common.CommonEnums;
using Gloobster.DomainModels.Services.Facebook.FriendsExtractor;
using Gloobster.SocialLogin.Facebook.Communication;
using Microsoft.AspNet.Mvc;
using Gloobster.Common.DbEntity;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModelsCommon.Interfaces;

//http://stackoverflow.com/questions/23417356/facebook-graph-api-v2-0-me-friends-returns-empty-or-only-friends-who-also-u
//https://www.sammyk.me/optimizing-request-queries-to-the-facebook-graph-api
//place query
//https://graph.facebook.com/search?q=coffee&type=place&center=37.76,122.427&distance=1000


//retreive permissions
//https://graph.facebook.com/me/permissions?access_token=CAAYZAZC0M01YIBAJ5v1XtsIUw8hjiKx8ZCwLosGjWvnbbpzZAcn7m92FDUp3VdgOZBoMITxKnynDm4DtL2Li8DY6R7XAaJ2P8zSxtHDV4RIuaCbEihLmIBnbqZBtipQheDHiQZA5PGjLNbkGsZAUSr9Gg7OzTN8DVi5kgxYym3DLE4E9iFoZCmIkx

namespace Gloobster.Portal.Controllers
{
    public class FriendsController: PortalBaseController
    {
		public FriendsController(IDbOperations db) : base(db)
		{
		}

		public async Task<IActionResult> List()
	    {		    		    
		    



			return View();
		}

	    private void DoFbThing()
	    {
			var portalUser = DB.C<PortalUserEntity>().FirstOrDefault(u => u.id == DBUserId);
			var fbSocAuth = portalUser.SocialAccounts.FirstOrDefault(s => s.NetworkType == SocialNetworkType.Facebook);

			bool hasFacebook = fbSocAuth != null;
			if (hasFacebook)
			{

			}

			var fbService = new FacebookService();
			fbService.SetAccessToken(fbSocAuth.Authentication.AccessToken);

			var fbFriendsService = new FacebookFriendsService(fbService);

			var friends = fbFriendsService.GetFriendsByFbUserId();

			friends = new List<FacebookUser> { new FacebookUser { id = "1031646796870176", name = "Bina Sabrina" } };

			var viewModel = new FriendsViewModel
			{
				AppFriends = friends
			};

		}

		

	}

	public class FriendsViewModel
	{
		public List<FacebookUser> AppFriends { get; set; }
	}


}
