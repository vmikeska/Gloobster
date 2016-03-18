using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
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
using Gloobster.ReqRes;
using MongoDB.Driver;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    
    public class WikiPhotoGalleryController : BaseApiController
    {
        public FilesDomain FileDomain { get; set; }
        public IWikiPermissions WikiPerms { get; set; }
        public IWikiChangeDomain ChangeEventSystem { get; set; }

        public WikiPhotoGalleryController(IWikiChangeDomain changeEventSystem, IWikiPermissions wikiPerms, IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            FileDomain = (FilesDomain) filesDomain;
            WikiPerms = wikiPerms;
            ChangeEventSystem = changeEventSystem;
        }
        
        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody] UpdateConfirmedRequest req)
        {
            if (!WikiPerms.HasArticleAdminPermissions(UserId, req.articleId))
            {
                return HttpUnauthorized();
            }

            var articleIdObj = new ObjectId(req.articleId);
            var photoIdObj = new ObjectId(req.photoId);

            var filter = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj) & DB.F<WikiCityEntity>().Eq("Photos.id", photoIdObj);
            var update = DB.U<WikiCityEntity>().Set("Photos.$.Confirmed", true);

            var res = await DB.UpdateAsync(filter, update);
            bool confirmed = res.ModifiedCount == 1;
            if (confirmed)
            {
                var evnt = new WikiEventDO
                {
                    ArticleId = req.articleId,
                    Lang = null,
                    Value = "ConfirmedPhoto",
                    EventType = EventType.Update,
                    AddId = req.photoId
                };
                ChangeEventSystem.ReceiveEvent(evnt);
            }
            
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
                using (var file = FileDomain.GetFile(galleryDir, name))
                {
                    SaveVersion(file, articleId, EventType.Delete);
                }
                
                FileDomain.Storage.DeleteFile(pathToDelete);
            }

            var nameThumb = $"{photoId}_thumb.jpg";
            var pathToThumb = FileDomain.Storage.Combine(galleryDir, nameThumb);
            bool thumbExists = FileDomain.Storage.FileExists(pathToThumb);
            if (thumbExists)
            {
                FileDomain.Storage.DeleteFile(pathToThumb);
            }

            var articleIdObj = new ObjectId(articleId);
            var photoIdObj = new ObjectId(photoId);
            RemovePhotoFromDb(articleIdObj, photoIdObj);

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

                    SaveVersion(stream, articleId, EventType.Create);
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
                FileLocation = articleDir,
                FileType = request.type
            };

            FileDomain.WriteFilePart(filePartDo);
            
            var res = string.Empty;
            if (fileId.HasValue)
            {
                res = fileId.ToString();
            }

            return new ObjectResult(res);
        }

        private void SaveVersion(Stream stream, string articleId, EventType eventType)
        {
            stream.Position = 0;
            var str64 = BitmapUtils.ConvertToBase64(stream);
            var evnt = new WikiEventDO
            {
                ArticleId = articleId,
                Lang = null,
                Value = "data:image/jpeg;base64," + str64,
                EventType = eventType,
                AddId = "Photo"
            };
            ChangeEventSystem.ReceiveEvent(evnt);
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

        private void RemovePhotoFromDb(ObjectId articleIdObj, ObjectId photoId)
        {
            var article = DB.C<WikiCityEntity>().FirstOrDefault(c => c.id == articleIdObj);
            var photo = article.Photos.FirstOrDefault(p => p.id == photoId);

            var filter = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj);
            var update = DB.U<WikiCityEntity>().Pull(p => p.Photos, photo);

            DB.UpdateAsync(filter, update);
        }

    }
}