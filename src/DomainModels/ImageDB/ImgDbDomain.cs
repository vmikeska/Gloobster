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

            var rootPath = FilesDomain.Storage.Combine(PhotosDir, update.PhotoId);

            var targetFilePath = FilesDomain.Storage.Combine(rootPath, $"{update.CutName}.jpg");
            FilesDomain.DeleteFile(targetFilePath);
            FilesDomain.Storage.SaveStream(targetFilePath, jpgStream);

            streamBitmap.Dispose();
            origBmp.Dispose();
            newBmp.Dispose();
            jpgStream.Dispose();

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

            var rootPath = FilesDomain.Storage.Combine(PhotosDir, id.ToString());

            var targetFilePath = FilesDomain.Storage.Combine(rootPath, "orig.jpg");
            FilesDomain.Storage.SaveStream(targetFilePath, jpgStream);

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
            if (cityEntity == null)
            {
                var city = await GNS.GetCityByIdAsync(newPhoto.GID);

                cityEntity = new ImageCityEntity
                {
                    id = ObjectId.GenerateNewId(),
                    GID = newPhoto.GID,
                    CountryCode = city.CountryCode,
                    CityName = city.AsciiName,
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

            GenerateCuts(origBmp, id.ToString());

            origBmp.Dispose();

            return id.ToString();
        }

        private void GenerateCuts(Bitmap origBmp, string id)
        {
            var cuts = DB.List<ImageCutEntity>();

            foreach (ImageCutEntity cut in cuts)
            {
                GenerateCut(origBmp, id, cut);
            }
        }

        private void GenerateCut(Bitmap origBmp, string id, ImageCutEntity cut)
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
                var rootPath = FilesDomain.Storage.Combine(PhotosDir, id);
                var filePath = FilesDomain.Storage.Combine(rootPath, $"{cut.ShortName}.jpg");
                FilesDomain.Storage.SaveStream(filePath, stream);
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
