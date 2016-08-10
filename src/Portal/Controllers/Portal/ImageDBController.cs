using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Gloobster.DomainInterfaces;
using Serilog;
using Autofac;
using Gloobster.Portal.ViewModels;
using Gloobster.DomainModels;
using Gloobster.DomainModels.ImageDB;

namespace Gloobster.Portal.Controllers.Portal
{
   
    public class ImageDBController : PortalBaseController
    {
        public IFilesDomain FileDomain;

        public ImageDBController(IFilesDomain fileDomain, ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
            FileDomain = fileDomain;
        }

       
        
        public IActionResult List()
        {
            var vm = CreateViewModelInstance<ImageDBListViewModel>();

            
            return View(vm);
        }

        public IActionResult Pic(string id, string cut)
        {
            var fileName = $"{cut}.jpg";

            var basePath = FileDomain.Storage.Combine(ImgDbDomain.PhotosDir, id);
            var fullPath = FileDomain.Storage.Combine(basePath, fileName);
            bool exists = FileDomain.Storage.FileExists(fullPath);
            if (exists)
            {
                var fileStream = FileDomain.GetFile(basePath, fileName);
                return new FileStreamResult(fileStream, "image/jpeg");
            }

            return null;
        }

        public IActionResult Picd(string id, string cut)
        {
            var fileName = $"{cut}.jpg";

            var basePath = FileDomain.Storage.Combine(ImgDbDomain.PhotosDir, ImgDbDomain.DefPhotosDir);
            var basePath2 = FileDomain.Storage.Combine(basePath, id);
            var fullPath = FileDomain.Storage.Combine(basePath2, fileName);
            bool exists = FileDomain.Storage.FileExists(fullPath);
            if (exists)
            {
                var fileStream = FileDomain.GetFile(fullPath);
                return new FileStreamResult(fileStream, "image/jpeg");
            }

            return null;
        }

        // /Picd/{{cityId}}/{{shortName}}
        


    }



}
