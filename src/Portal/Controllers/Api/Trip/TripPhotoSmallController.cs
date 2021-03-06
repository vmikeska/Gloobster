using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
    public class TripPhotoSmallController : BaseApiController
    {
        public FilesDomain FileDomain { get; set; }
        
        public TripPhotoSmallController(IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            FileDomain = (FilesDomain) filesDomain;
        }

        private bool LogsOn = false;

        private void WriteLog(string text)
        {
            if (LogsOn)
            {
                var txt = $"FilesDomainC: {text}";
                Log.Debug(txt);
            }
        }

        [HttpPost]
        [AuthorizeApi]
        public IActionResult Post([FromBody] FileRequest request)
        {
            var tripId = request.customId;
            var tripDir = FileDomain.Storage.Combine(TripFileConstants.FileLocation, tripId);
            var tripIdObj = new ObjectId(tripId);

            FileDomain.OnFileSaved += (sender, args) =>
            {
                //var argsObj = (OnFileSavedArgs) args;

                UpdatePicSaved(tripIdObj, true);
            };

            FileDomain.OnBeforeCreate += (sender, args) =>
            {
                MemoryStream bytesStream = null;
                try
                {
                    WriteLog($"OnBeforeCreate, trip photo small start");

                    DeleteOldPicture(tripDir, TripFileConstants.SmallPicNameExt_s);
                    DeleteOldPicture(tripDir, TripFileConstants.SmallPicNameExt_xs);

                    bytesStream = new MemoryStream(FileDomain.AllBytes);

                    var origBmp = new Bitmap(bytesStream);

                    using (var stream = GeneratePic(origBmp, 0.810f, 1.0f, TripFileConstants.SmallWidth_s,TripFileConstants.SmallHeight_s))
                    {
                        var path = FileDomain.Storage.Combine(tripDir, TripFileConstants.SmallPicNameExt_s);
                        FileDomain.Storage.SaveStream(path, stream);
                    }

                    using (var stream = GeneratePic(origBmp, 1.0f, 1.0f, TripFileConstants.SmallWidth_xs,TripFileConstants.SmallHeight_xs))
                    {
                        var path = FileDomain.Storage.Combine(tripDir, TripFileConstants.SmallPicNameExt_xs);
                        FileDomain.Storage.SaveStream(path, stream);
                    }

                    FileDomain.DoNotSave = true;
                }
                catch (Exception exc)
                {
                    WriteLog($"OnBeforeCreate, trip photo small: {exc.Message}");
                    throw;
                }
                finally
                {
                    bytesStream?.Dispose();
                }
            };

            var filePartDo = new WriteFilePartDO
            {
                Data = request.data,
                UserId = UserId,
                FileName = request.fileName,
                FilePart = request.filePartType,
                CustomFileName = TripFileConstants.BigPicName,
                FileLocation = tripDir,
                FileType = request.type
            };

            FileDomain.WriteFilePart(filePartDo);

            return new ObjectResult(null);
        }

        private Stream GeneratePic(Bitmap origBitmap, float rateWidth, float rateHeight, int newWidth, int newHeight)
        {
            Bitmap cutBmp = null;
            Bitmap newBmp = null;

            try
            {
                Rectangle rect = BitmapUtils.CalculateBestImgCut(origBitmap.Width, origBitmap.Height, rateWidth, rateHeight);
                cutBmp = BitmapUtils.ExportPartOfBitmap(origBitmap, rect);
                newBmp = BitmapUtils.ResizeImage(cutBmp, newWidth, newHeight);
                Stream jpgStream = BitmapUtils.ConvertBitmapToJpg(newBmp, 90);

                jpgStream.Position = 0;
                
                return jpgStream;
            }
            finally
            {
                cutBmp?.Dispose();
                newBmp?.Dispose();
            }
        }

        private void UpdatePicSaved(ObjectId tripIdObj, bool state)
        {
            var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
            var update = DB.U<TripEntity>().Set(p => p.HasSmallPicture, state);

            DB.UpdateAsync(filter, update);
        }

        private void DeleteOldPicture(string tripDir, string fileName)
        {            
            var pathToDelete = FileDomain.Storage.Combine(tripDir, fileName);            
            FileDomain.DeleteFile(pathToDelete);                        
        }
    }
}