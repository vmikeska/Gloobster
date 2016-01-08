using System;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ViewModels;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Gloobster.DomainInterfaces;
using Microsoft.AspNet.Http;

namespace Gloobster.Portal.Controllers.Portal
{
    public class PinBoardController : PortalBaseController
    {
		public ISharedMapImageDomain SharedImgDomain { get; set; }

		public PinBoardController(ISharedMapImageDomain sharedImgDomain, IDbOperations db) : base(db)
		{
			SharedImgDomain = sharedImgDomain;
		}
    
	    public IActionResult Pins()
	    {
			var pinBoardViewModel = CreateViewModelInstance<PinBoardViewModel>();			
			pinBoardViewModel.Initialize(UserId);
            
            return View(pinBoardViewModel);
		}

		public IActionResult SharedMapImage(string id)
		{
			var mapStream = SharedImgDomain.GetPinBoardMap(id);				
			return new FileStreamResult(mapStream, "image/png");
		}


	}
}
