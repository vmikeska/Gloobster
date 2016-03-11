using System.Drawing;
using System.IO;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.DomainObjects;
using Gloobster.Entities.Trip;
using Gloobster.Entities.Wiki;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class WikiFileConstants
    {
        public const string FileLocation = "wiki";
        public const string TitlePhotoName = "title";
        public const string TitlePhotoNameExt = "title.jpg";
        public const int TitleWidth = 940;
        public const int TitleHeight = 280;
    }

    public class WikiTitlePhotoController : BaseApiController
    {
        public FilesDomain FileDomain { get; set; }
        
        public WikiTitlePhotoController(IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            FileDomain = (FilesDomain) filesDomain;
        }
        
        [HttpPost]
        [AuthorizeApi]
        public IActionResult Post([FromBody] FileRequest request)
        {
            var articleId = request.customId;
            var articleDir = FileDomain.Storage.Combine(WikiFileConstants.FileLocation, articleId);
            var articleIdObj = new ObjectId(articleId);

            FileDomain.OnFileSaved += (sender, args) =>
            {
                var argsObj = (OnFileSavedArgs) args;

                UpdatePicSaved(articleIdObj, true);
            };

            FileDomain.OnBeforeCreate += (sender, args) =>
            {
                DeleteOldPicture(articleDir, WikiFileConstants.TitlePhotoNameExt);
                
                var bytesStream = new MemoryStream(FileDomain.AllBytes);

                var origBmp = new Bitmap(bytesStream);

                using (var stream = GeneratePic(origBmp, 1.0f, 0.2978f, WikiFileConstants.TitleWidth, WikiFileConstants.TitleHeight))
                {
                    var path = FileDomain.Storage.Combine(articleDir, WikiFileConstants.TitlePhotoNameExt);
                    FileDomain.Storage.SaveStream(path, stream);
                }
                
                FileDomain.DoNotSave = true;
            };

            var filePartDo = new WriteFilePartDO
            {
                Data = request.data,
                UserId = UserId,
                FileName = request.fileName,
                FilePart = request.filePartType,
                CustomFileName = WikiFileConstants.TitlePhotoName,
                FileLocation = articleDir,
                FileType = request.type
            };

            FileDomain.WriteFilePart(filePartDo);

            return new ObjectResult(null);
        }

        private Stream GeneratePic(Bitmap origBitmap, float rateWidth, float rateHeight, int newWidth, int newHeight)
        {
            var rect = BitmapUtils.CalculateBestImgCut(origBitmap.Width, origBitmap.Height, rateWidth, rateHeight);
            var cutBmp = BitmapUtils.ExportPartOfBitmap(origBitmap, rect);
            var newBmp = BitmapUtils.ResizeImage(cutBmp, newWidth, newHeight);
            var jpgStream = BitmapUtils.ConvertBitmapToJpg(newBmp, 90);

            jpgStream.Position = 0;

            cutBmp.Dispose();
            newBmp.Dispose();

            return jpgStream;
        }

        private void UpdatePicSaved(ObjectId articleIdObj, bool state)
        {
            var filter = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj);
            var update = DB.U<WikiCityEntity>().Set(p => p.HasTitlePhoto, state);

            DB.UpdateAsync(filter, update);
        }

        private void DeleteOldPicture(string articleDir, string fileName)
        {            
            var pathToDelete = FileDomain.Storage.Combine(articleDir, fileName);
            bool fileExists = FileDomain.Storage.FileExists(pathToDelete);
            if (fileExists)
            {
                FileDomain.Storage.DeleteFile(pathToDelete);
            }            
        }
    }
}