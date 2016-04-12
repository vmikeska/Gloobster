﻿using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.GeonamesService;
using Gloobster.DomainModels.Wiki;
using Gloobster.Portal.ViewModels;
using Serilog;
using System.Linq;
using System.Web;
using Autofac;
using Gloobster.Entities;
using Microsoft.AspNet.Http;

namespace Gloobster.Portal.Controllers.Portal
{
    public class HomeController : PortalBaseController
    {		
        public HomeController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
            
		}
        
        [CreateAccount]
        public IActionResult Index()
        {
            bool isLogged = IsUserLogged && DB.List<UserEntity>(e => e.User_id == UserIdObj).Any();
                //HttpContext.Request.Cookies.ContainsKey(TokenConstants.CookieKeyName);
            if (isLogged)
            {                
                return RedirectToAction("Pins", "Pinboard");                
            }
            
            var viewModel = CreateViewModelInstance<ViewModelHome>();
            viewModel.DefaultLangModuleName = "pageHomeOld";            
            return View(viewModel);
        }

        public IActionResult Component(string id)
        {
            var viewModel = CreateViewModelInstance<ViewModelComponent>();
            viewModel.Id = id;
            return View(viewModel);
        }

        public async Task<IActionResult> TestConn()
        {
            string res = "Ok";

            try
            {
                var db = new DbOperations();
            }
            catch (Exception exc)
            {
                res = exc.Message;
            }
            

            return View(res);
        }
        
        //   public IActionResult Test2()
        //   {

        //       return View();
        //   }


    }
}
