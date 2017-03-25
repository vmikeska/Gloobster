using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Wiki;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Microsoft.AspNet.Mvc;
using Serilog;
using Gloobster.ReqRes;
using MongoDB.Bson;
using System.Linq;
using Gloobster.Common;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public enum LayoutSize { Web, Mobile}

    public class WidhtHeight
    {
        public int Width { get; set; }
        public int Height { get; set; }
    }

    public class PhotoInfo
    {
        public string ArticleId { get; set; }
        public string PhotoId { get; set; }
    }

    public class ThumbResult
    {
        public string articleId { get; set; }
        public string photoId { get; set; }
        public string data { get; set; }
    }

    public class ThumbsRequest
    {
        public string articleId { get; set; }
        public LayoutSize layoutSize { get; set; }
        public int photosLimit { get; set; }
    }

    public class WikiPhotoThumbnailsController : BaseApiController
    {
        public FilesDomain FileDomain { get; set; }                
        
        public WikiPhotoThumbnailsController(IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            FileDomain = (FilesDomain) filesDomain;                                    
        }

        private WidhtHeight GetNewWidthHeight(int cnt, LayoutSize layoutSize)
        {
            var res = new WidhtHeight();

            if (layoutSize == LayoutSize.Web)
            {
                if (cnt <= 2)
                {
                    res.Width = 150;
                }
                else
                {
                    res.Width = 100;
                }                
            }

            if (layoutSize == LayoutSize.Mobile)
            {
                res.Width = 280;
            }
            
            res.Height = (int)(((float)res.Width) * 0.66);
            return res;
        }

        [HttpGet]
        public IActionResult Get(ThumbsRequest req)
        {
            var aid = new ObjectId(req.articleId);

            var texts = DB.FOD<WikiTextsEntity>(t => t.Article_id == aid);

            var photos = new List<PhotoInfo>();

            if (texts.Type == ArticleType.City)
            {
                var city = DB.FOD<WikiCityEntity>(c => c.id == aid);                
                var photosIds = city.Photos.Where(p => p.Confirmed).Select(a => a.id.ToString()).ToList();
                photos = photosIds.Select(p => new PhotoInfo {PhotoId = p, ArticleId = req.articleId }).ToList();
            }

            if (texts.Type == ArticleType.Country)
            {
                var country = DB.FOD<WikiCountryEntity>(c => c.id == aid);

                var cities = DB.List<WikiCityEntity>(c => c.Photos.Count > 0 && c.CountryCode == country.CountryCode);
                
                foreach (var city in cities)
                {
                    var pids = city.Photos.Where(p => p.Confirmed).Select(a => a.id.ToString()).ToList();

                    foreach (var pid in pids)
                    {
                        var photo = new PhotoInfo {ArticleId = city.id.ToString(), PhotoId = pid};
                        photos.Add(photo);
                    }                                        
                }                
            }

            var thumbs = new List<ThumbResult>();
            
            var widthHeight = GetNewWidthHeight(photos.Count, req.layoutSize);


            var limitedPhotos = photos.Take(req.photosLimit).ToList();

            foreach (var photo in limitedPhotos)
            {
                var articleDir = FileDomain.Storage.Combine(WikiFileConstants.FileLocation, photo.ArticleId);
                var galleryDir = FileDomain.Storage.Combine(articleDir, WikiFileConstants.GalleryDir);

                var photoName = $"{photo.PhotoId}.jpg";

                var origFileStream = FileDomain.GetFile(galleryDir, photoName);

                var thumbStream = GeneratePic(origFileStream, widthHeight.Width, widthHeight.Height);

                var thumbBase64 = BitmapUtils.ConvertToBase64(thumbStream);

                var photoRes = new ThumbResult {data = thumbBase64, photoId = photo.PhotoId, articleId = photo.ArticleId};
                thumbs.Add(photoRes);
            }
            
            return new ObjectResult(thumbs);
        }
        
        private Stream GeneratePic(Stream origFileStream, int newWidth, int newHeight)
        {
            Bitmap origBitmap = new Bitmap(origFileStream);

            float rateWidth = 1.0f;
            float rateHeight = ((float)newHeight) / ((float)newWidth);


            var rect = BitmapUtils.CalculateBestImgCut(origBitmap.Width, origBitmap.Height, rateWidth, rateHeight);
            var cutBmp = BitmapUtils.ExportPartOfBitmap(origBitmap, rect);
            var newBmp = BitmapUtils.ResizeImage(cutBmp, newWidth, newHeight);
            var jpgStream = BitmapUtils.ConvertBitmapToJpg(newBmp, 90);

            jpgStream.Position = 0;

            cutBmp.Dispose();
            newBmp.Dispose();

            return jpgStream;
        }
    }
}