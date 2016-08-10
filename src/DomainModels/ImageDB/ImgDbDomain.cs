using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.ImageDB;
using MongoDB.Bson;

namespace Gloobster.DomainModels.ImageDB
{
    public class ImgDbDomain: IImgDbDomain
    {
        public const string PhotosDir = "pdb";
        public const string DefPhotosDir = "d";

        public IFilesDomain FilesDomain { get; set; }
        public IGeoNamesService GNS { get; set; }
        public IDbOperations DB { get; set; }

        public async Task UpdateImageCut(UpdateDbImgCutDO update)
        {
            var cutIdObj = new ObjectId(update.CutId);
            var cut = DB.FOD<ImageCutEntity>(c => c.id == cutIdObj);
            
            var imgData = CutOffMetaData(update.Data);

            var bitmapData = Convert.FromBase64String(imgData);
            var streamBitmap = new MemoryStream(bitmapData);
            var origBmp = new Bitmap((Bitmap)Image.FromStream(streamBitmap));

            var newBmp = BitmapUtils.ResizeImage(origBmp, cut.Width, cut.Height);

            var jpgStream = BitmapUtils.ConvertBitmapToJpg(newBmp, 90);
            jpgStream.Position = 0;

            var targetFilePath = GetPhotoPath(update.PhotoId, update.CutName);
            
            FilesDomain.DeleteFile(targetFilePath);
            FilesDomain.Storage.SaveStream(targetFilePath, jpgStream);

            streamBitmap.Dispose();
            origBmp.Dispose();
            newBmp.Dispose();
            jpgStream.Dispose();

        }

        
        public async Task DeletePhoto(ImgDbPhotoDelDO del)
        {
            var rootPath = FilesDomain.Storage.Combine(PhotosDir, del.ImgId);
            FilesDomain.DeleteFolder(rootPath);

            var imgIdObj = new ObjectId(del.ImgId);
            var cityIdObj = new ObjectId(del.CityId);

            var f = DB.F<ImageCityEntity>().Eq(p => p.id, cityIdObj);
            var u = DB.PF<ImageCityEntity, ImageSE>(t => t.Images, c => c.id == imgIdObj);
            var result = await DB.UpdateAsync(f, u);
            
        }

        public async Task AddNewCut(CutDO cutDo)
        {
            var cut = new ImageCutEntity
            {
                id = ObjectId.GenerateNewId(),
                Name = cutDo.Name,
                ShortName = cutDo.ShortName,
                Width = cutDo.Width,
                Height = cutDo.Height
            };

            await DB.SaveAsync(cut);

            var cities = DB.List<ImageCityEntity>();
            foreach (var city in cities)
            {
                var isFirst = true;
                foreach (var img in city.Images)
                {                    
                    var imgId = img.id.ToString();
                    var photoPath = GetPhotoPath(imgId, "orig");
                    var fileStream = FilesDomain.GetFile(photoPath);
                    
                    var bmp = new Bitmap(fileStream);
                    
                    GenerateCut(bmp, city.GID, cut, isFirst, imgId);
                    isFirst = false;
                }                
            }
        }

        public async Task SetDefaultCityPhotoCut(DefaultDO req)
        {
            var cityIdObj = new ObjectId(req.CityId);
            var cutIdObj = new ObjectId(req.CutId);
            var imgIdObj = new ObjectId(req.PhotoId);

            var city = DB.FOD<ImageCityEntity>(c => c.id == cityIdObj);

            var cut = DB.FOD<ImageCutEntity>(c => c.id == cutIdObj);

            var f = DB.F<ImageCityEntity>().Eq(i => i.id, cityIdObj) & DB.F<ImageCityEntity>().Eq("DefaultCuts.Cut_id", cutIdObj);
            var u = DB.U<ImageCityEntity>().Set("DefaultCuts.$.Img_id", imgIdObj);
            var res = await DB.UpdateAsync(f, u);
            
            var fromFilePath = GetPhotoPath(req.PhotoId, cut.ShortName);            
            var toFilePath = GetDefaultPhotoPath(city.GID, cut.ShortName);
            
            FilesDomain.CopyFile(fromFilePath, toFilePath);
        }

        private string GetPhotoPath(string photoId, string shortName)
        {
            var fileName = $"{shortName}.jpg";

            var fromRootPath = FilesDomain.Storage.Combine(PhotosDir, photoId);
            var fromFilePath = FilesDomain.Storage.Combine(fromRootPath, fileName);
            return fromFilePath;
        }

        private string GetDefaultPhotoPath(int gid, string shortName)
        {
            var fileName = $"{shortName}.jpg";

            var toRootPath = FilesDomain.Storage.Combine(PhotosDir, DefPhotosDir);            
            var toRoot2Path = FilesDomain.Storage.Combine(toRootPath, gid.ToString());
            var toFilePath = FilesDomain.Storage.Combine(toRoot2Path, fileName);
            return toFilePath;
        }

        public async Task<string> AddNewPhoto(NewDbImgDO newPhoto)
        {
            var id = ObjectId.GenerateNewId();

            var imgData = CutOffMetaData(newPhoto.Data);

            var bitmapData = Convert.FromBase64String(imgData);
            var streamBitmap = new MemoryStream(bitmapData);
            var origBmp = new Bitmap((Bitmap)Image.FromStream(streamBitmap));

            var jpgStream = BitmapUtils.ConvertBitmapToJpg(origBmp, 90);
            jpgStream.Position = 0;
            
            var origFilePath = GetPhotoPath(id.ToString(), "orig");                
            FilesDomain.Storage.SaveStream(origFilePath, jpgStream);

            streamBitmap.Dispose();

            jpgStream.Dispose();

            var imgEntity = new ImageSE
            {
                id = id,
                Desc = newPhoto.Desc,
                IsFree = newPhoto.IsFree,
                Origin = newPhoto.Origin
            };

            var cityEntity = DB.FOD<ImageCityEntity>(e => e.GID == newPhoto.GID);
            bool isFirst = (cityEntity == null);
            if (isFirst)
            {
                var city = await GNS.GetCityByIdAsync(newPhoto.GID);

                var cuts = DB.List<ImageCutEntity>();

                cityEntity = new ImageCityEntity
                {
                    id = ObjectId.GenerateNewId(),
                    GID = newPhoto.GID,
                    CountryCode = city.CountryCode,
                    CityName = city.AsciiName,
                    DefaultCuts = cuts.Select(c => new DefaultCutSE {Cut_id = c.id, Img_id = id}).ToList(),
                    Images = new List<ImageSE> { imgEntity }
                };
                await DB.SaveAsync(cityEntity);
            }
            else
            {
                var f = DB.F<ImageCityEntity>().Eq(i => i.id, cityEntity.id);
                var u = DB.U<ImageCityEntity>().Push(i => i.Images, imgEntity);
                var res = await DB.UpdateAsync(f, u);
            }

            GenerateCuts(origBmp, cityEntity.GID, isFirst, imgEntity.id.ToString());

            origBmp.Dispose();

            return id.ToString();
        }

        private void GenerateCuts(Bitmap origBmp, int gid, bool isFirst, string photoId)
        {
            var cuts = DB.List<ImageCutEntity>();

            foreach (ImageCutEntity cut in cuts)
            {
                GenerateCut(origBmp, gid, cut, isFirst, photoId);
            }
        }

        private void GenerateCut(Bitmap origBmp, int gid, ImageCutEntity cut, bool isFirst, string photoId)
        {
            float wRate = 1.0f;
            float hRate = 1.0f;

            if (cut.Width > cut.Height)
            {
                hRate = (float)cut.Height / (float)cut.Width;
            }
            else
            {
                wRate = (float)cut.Width / (float)cut.Height;
            }

            using (var stream = GeneratePic(origBmp, wRate, hRate, cut.Width, cut.Height))
            {
                var filePath = GetPhotoPath(photoId, cut.ShortName);
                
                FilesDomain.Storage.SaveStream(filePath, stream);

                if (isFirst)
                {
                    stream.Position = 0;

                    var defFilePath = GetDefaultPhotoPath(gid, cut.ShortName);

                    FilesDomain.Storage.SaveStream(defFilePath, stream);
                }
            }
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

        private string CutOffMetaData(string data)
        {
            var prms = data.Split(',');
            var newData = prms[1];
            return newData;
        }
    }
}
