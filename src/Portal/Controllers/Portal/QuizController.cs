using System;
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
using Gloobster.Common;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.Entities;
using Gloobster.Entities.SearchEngine;
using Gloobster.Entities.Trip;
using Microsoft.AspNet.Http;
using Gloobster.DomainModels;
using Gloobster.Portal.Controllers.Api.Wiki;
using Gloobster.Portal.Controllers.Api.Wiki.Admin;

namespace Gloobster.Portal.Controllers.Portal
{
    public class QuizController : PortalBaseController
    {	
        public IFilesDomain FileDomain { get; set; }
        
        public QuizController(IFilesDomain fileDomain, ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
            FileDomain = fileDomain;
        }

        [CreateAccount]
        public IActionResult Detail(string id)
        {


            var lang = "en";

            QuizEntity quiz = DB.FOD<QuizEntity>(q => q.TitleUrl == id);
            
            var vm = CreateViewModelInstance<ViewModelQuiz>();
            vm.Quiz = quiz;
            //vm.DefaultLangModuleName = "pageHome";
            vm.LoadClientTexts();

            return View(vm);
        }


        public IActionResult Photo(int quizNo, int itemNo)
        {
            var filePath = QuizPhotoConsts.GetFilePath(FileDomain, quizNo, itemNo);
            
            bool exists = FileDomain.Storage.FileExists(filePath);
            if (exists)
            {
                var fileStream = FileDomain.GetFile(filePath);
                return new FileStreamResult(fileStream, "image/jpeg");
            }

            return null;
        }

       

    }
}
