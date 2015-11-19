using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.IO;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.Entities.Trip;
using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Portal
{
	public class DestinationController : PortalBaseController
	{
		public DestinationController(IDbOperations db) : base(db)
		{
			
		}

		public IActionResult Planning()
		{
			var viewModel = CreateViewModelInstance<ViewModelPlanning>();

			return View(viewModel);
		}

	}

	

}