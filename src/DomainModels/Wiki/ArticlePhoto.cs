using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace Gloobster.DomainModels.Wiki
{
    public class WikiFileConstants
    {
        public const string FileLocation = "wiki";
        public const string GalleryDir = "g";
        public const string TitlePhotoName = "title";
        public const string TitlePhotoNameExt = "title.jpg";
        public const int TitleWidth = 940;
        public const int TitleHeight = 280;

        public const int ThumbnailWidth = 280;
        public const int ThumbnailHeight = 190;
    }

    public class ArticlePhotoData
    {
        public string ArticleName { get; set; }
    }

    public class ArticlePhoto : IArticlePhoto
    {
        public IDbOperations DB { get; set; }
        public IWikiPermissions WikiPerms { get; set; }
        public IWikiChangeDomain ChangeEventSystem { get; set; }
        public IFilesDomain FileDomain { get; set; }
        public IWikiAdminTasks AdminTasks { get; set; }

        public async Task<bool> Confirm(string userId, string articleId, string photoId)
        {
            if (!WikiPerms.HasArticleAdminPermissions(userId, articleId))
            {
                return false;
            }

            var articleIdObj = new ObjectId(articleId);
            var photoIdObj = new ObjectId(photoId);

            var filter = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj) & DB.F<WikiCityEntity>().Eq("Photos.id", photoIdObj);
            var update = DB.U<WikiCityEntity>().Set("Photos.$.Confirmed", true);

            var res = await DB.UpdateAsync(filter, update);
            bool confirmed = res.ModifiedCount == 1;
            if (confirmed)
            {
                var evnt = new WikiEventDO
                {
                    ArticleId = articleId,
                    Lang = null,
                    Value = "ConfirmedPhoto",
                    EventType = EventType.Update,
                    AddId = photoId
                };
                ChangeEventSystem.ReceiveEvent(evnt);
            }

            return true;
        }

        public bool Delete(string userId, string articleId, string photoId)
        {
            if (!WikiPerms.HasArticleAdminPermissions(userId, articleId))
            {
                return false;
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

            return true;
        }

        public string ReceiveFilePart(string articleId, string userId, WriteFilePartDO filePartDo)
        {
            var userIdObj = new ObjectId(userId);

            bool isUserAdmin = WikiPerms.HasArticleAdminPermissions(userId, articleId);

            var articleDir = FileDomain.Storage.Combine(WikiFileConstants.FileLocation, articleId);
            var galleryDir = FileDomain.Storage.Combine(articleDir, WikiFileConstants.GalleryDir);

            var articleIdObj = new ObjectId(articleId);

            ObjectId? fileId = null;
            if (filePartDo.FilePart == FilePartType.Last)
            {
                fileId = ObjectId.GenerateNewId();
            }
            
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

                bool confirmed = isUserAdmin;
                AddPhotoToDb(userIdObj, articleIdObj, fileId.Value, confirmed);

                if (!confirmed)
                {
                    var texts = DB.FOD<WikiTextsEntity>(e => e.Article_id == articleIdObj);

                    var dataObj = new ArticlePhotoData
                    {
                        ArticleName = texts.Title
                    };

                    var dataString = JsonConvert.SerializeObject(dataObj);

                    var task = new NewTaskDO
                    {
                        TaskType = AdminTaskType.ConfirmPhoto,
                        ArticleId = articleId,
                        TargetId = fileId.ToString(),
                        Data = dataString
                    };
                    AdminTasks.AddTask(task);
                }

                FileDomain.DoNotSave = true;
            };

            FileDomain.WriteFilePart(filePartDo);

            var res = string.Empty;
            if (fileId.HasValue)
            {
                res = fileId.ToString();
            }
            return res;
        }

        private void AddPhotoToDb(ObjectId userIdObj, ObjectId articleIdObj, ObjectId photoId, bool confirmed)
        {
            var photo = new WikiPhotoSE
            {
                id = photoId,
                Description = "",
                Inserted = DateTime.UtcNow,
                Owner_id = userIdObj,
                Confirmed = confirmed
            };

            var filter = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj);
            var update = DB.U<WikiCityEntity>().Push(p => p.Photos, photo);

            DB.UpdateAsync(filter, update);
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
        
        public void SaveVersionCreate(Stream stream, string articleId)
        {
            SaveVersion(stream, articleId, EventType.Create);
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