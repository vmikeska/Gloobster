using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using Serilog;

//http://stackoverflow.com/questions/23417356/facebook-graph-api-v2-0-me-friends-returns-empty-or-only-friends-who-also-u
//https://www.sammyk.me/optimizing-request-queries-to-the-facebook-graph-api
//place query
//https://graph.facebook.com/search?q=coffee&type=place&center=37.76,122.427&distance=1000


//retreive permissions
//https://graph.facebook.com/me/permissions?access_token=CAAYZAZC0M01YIBAJ5v1XtsIUw8hjiKx8ZCwLosGjWvnbbpzZAcn7m92FDUp3VdgOZBoMITxKnynDm4DtL2Li8DY6R7XAaJ2P8zSxtHDV4RIuaCbEihLmIBnbqZBtipQheDHiQZA5PGjLNbkGsZAUSr9Gg7OzTN8DVi5kgxYym3DLE4E9iFoZCmIkx

namespace Gloobster.Portal.Controllers.Portal
{
    public class FriendsController: PortalBaseController
    {
		public FriendsController(ILogger log, IDbOperations db) : base(log, db)
		{
		}

        [AuthorizeAttributeWeb]
		public IActionResult List()
		{
			var viewModel = CreateViewModelInstance<ViewModelBase>();			
			return View(viewModel);
		}
		
	}

}
