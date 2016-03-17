using System;
using System.Drawing;
using System.IO;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
using Gloobster.Entities.Wiki;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;
using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    
    public class WikiPhotoGalleryController : BaseApiController
    {
        public FilesDomain FileDomain { get; set; }
        public IWikiPermissions WikiPerms { get; set; }

        public WikiPhotoGalleryController(IWikiPermissions wikiPerms, IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            FileDomain = (FilesDomain) filesDomain;
            WikiPerms = wikiPerms;
        }
        
        [HttpPut]
        [AuthorizeApi]
        public IActionResult Put([FromBody] UpdateConfirmedRequest req)
        {
            if (!WikiPerms.HasArticleAdminPermissions(UserId, req.articleId))
            {
                return HttpUnauthorized();
            }

            var articleIdObj = new ObjectId(req.articleId);
            var photoIdObj = new ObjectId(req.photoId);

            var filter = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj) & DB.F<WikiCityEntity>().Eq("Photos.id", photoIdObj);
            var update = DB.U<WikiCityEntity>().Set("Photos.$.Confirmed", true);

            DB.UpdateAsync(filter, update);

            return new ObjectResult(null);
        }

        [HttpDelete]
        [AuthorizeApi]
        public IActionResult Delete(string articleId, string photoId)
        {
            if (!WikiPerms.HasArticleAdminPermissions(UserId, articleId))
            {
                return HttpUnauthorized();
            }

            var articleDir = FileDomain.Storage.Combine(WikiFileConstants.FileLocation, articleId);
            var galleryDir = FileDomain.Storage.Combine(articleDir, WikiFileConstants.GalleryDir);
            var name = $"{photoId}.jpg";
            var pathToDelete = FileDomain.Storage.Combine(galleryDir, name);
            bool fileExists = FileDomain.Storage.FileExists(pathToDelete);
            if (fileExists)
            {
                FileDomain.Storage.DeleteFile(pathToDelete);
            }

            return new ObjectResult(null);
        }

        [HttpPost]
        [AuthorizeApi]
        public IActionResult Post([FromBody] FileRequest request)
        {
            var articleId = request.customId;
            bool isUserAdmin = WikiPerms.HasArticleAdminPermissions(UserId, articleId);

            var articleDir = FileDomain.Storage.Combine(WikiFileConstants.FileLocation, articleId);
            var galleryDir = FileDomain.Storage.Combine(articleDir, WikiFileConstants.GalleryDir); 
            
            var articleIdObj = new ObjectId(articleId);
            
            ObjectId? fileId = null;
            if (request.filePartType == FilePartType.Last)
            {
                fileId = ObjectId.GenerateNewId();
            }
            
            FileDomain.OnFileSaved += (sender, args) =>
            {
                var argsObj = (OnFileSavedArgs) args;                                
            };

            FileDomain.OnBeforeCreate += (sender, args) =>
            {                
                var bytesStream = new MemoryStream(FileDomain.AllBytes);
                var origBmp = new Bitmap(bytesStream);
                
                using (var stream = GeneratePic(origBmp, 1.0f, 0.6785f, WikiFileConstants.ThumbnailWidth, WikiFileConstants.ThumbnailHeight))
                {
                    var thumbName = $"{fileId.ToString()}_thumb.jpg";
                    var path = FileDomain.Storage.Combine(galleryDir, thumbName);
                    FileDomain.Storage.SaveStream(path, stream);
                }
                
                using (var stream = BitmapUtils.ConvertBitmapToJpg(origBmp, 95))
                {
                    var name = $"{fileId.ToString()}.jpg";
                    var path = FileDomain.Storage.Combine(galleryDir, name);
                    FileDomain.Storage.SaveStream(path, stream);
                }

                AddPhotoToDb(articleIdObj, fileId.Value, isUserAdmin);

                FileDomain.DoNotSave = true;
            };

            var filePartDo = new WriteFilePartDO
            {
                Data = request.data,
                UserId = UserId,
                FileName = request.fileName,
                FilePart = request.filePartType,
                //CustomFileName = "",
                FileLocation = articleDir,
                FileType = request.type
            };

            FileDomain.WriteFilePart(filePartDo);

            //return new ObjectResult(null);
            var res = string.Empty;
            if (fileId.HasValue)
            {
                res = fileId.ToString();
            }

            return new ObjectResult(res);
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

        private void AddPhotoToDb(ObjectId articleIdObj, ObjectId photoId, bool confirmed)
        {
            var photo = new WikiPhotoSE
            {
                id = photoId,
                Description = "",
                Inserted = DateTime.UtcNow,
                Owner_id = UserIdObj,
                Confirmed = confirmed
            };

            var filter = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj);            
            var update = DB.U<WikiCityEntity>().Push(p => p.Photos, photo);

            DB.UpdateAsync(filter, update);
        }
        
    }

    public class UpdateConfirmedRequest
    {
        public string articleId { get; set; }
        public string photoId { get; set; }
    }
}