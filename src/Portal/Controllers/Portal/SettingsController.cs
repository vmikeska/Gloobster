using Gloobster.Common;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Common.CommonEnums;
using Gloobster.Common.DbEntity;
using Microsoft.AspNet.Http;
using TweetSharp;

namespace Gloobster.Portal.Controllers
{
	public class SettingsController : Controller
	{
		public IDbOperations DB;

		public string UserId
		{
			get
			{
				var userIdSession = Context.Session.GetString(PortalConstants.UserSessionId);
				return userIdSession;
			}
		}

		//public bool IsUserLogged => !string.IsNullOrEmpty(UserId);s
		
		public SettingsController(IDbOperations db)
		{
			DB = db;
		}




		public IActionResult Detail()
		{
			return View();
		}
	}
}
