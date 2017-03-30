using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.ViewModels;
using Serilog;
using Autofac;
using Gloobster.Entities;
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
            vm.DefaultLangModuleName = "pageQuiz";
            vm.LoadClientTexts();
            
            vm.FbShareMeta.og_url = $"https://gloobster.com/quiz/{quiz.TitleUrl}";
            vm.FbShareMeta.og_title = string.Format(vm.W("QuizShareTitle"), quiz.Title);
            vm.FbShareMeta.og_description = vm.W("QuizShareDescription"); 
            vm.FbShareMeta.og_image = "https://gloobster.com/images/n/QuizTitleSmall.jpg";
            vm.FbShareMeta.og_image_type = "image/jpg";
            
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
