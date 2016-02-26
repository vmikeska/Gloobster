using System.Drawing;
using System.IO;
using System.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.DomainObjects;
using Gloobster.Entities.Trip;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
    
	public class TripPhotoController : BaseApiController
	{		
		public FilesDomain FileDomain { get; set; }
        
        public TripPhotoController(IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
		{			
			FileDomain = (FilesDomain)filesDomain;
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
				var argsObj = (OnFileSavedArgs)args;

			    UpdatePicSaved(tripIdObj, true);
			};

			FileDomain.OnBeforeCreate += (sender, args) =>
			{
			    DeleteOldPicture(tripIdObj, tripDir);

                var bytesStream = new MemoryStream(FileDomain.AllBytes);

                var origBmp = new Bitmap(bytesStream);
                var rect = BitmapUtils.CalculateBestImgCut(origBmp.Width, origBmp.Height, 1.0f, 0.27916f);
                var cutBmp = BitmapUtils.ExportPartOfBitmap(origBmp, rect);
                var newBmp = BitmapUtils.ResizeImage(cutBmp, TripFileConstants.BackgroundWidth, TripFileConstants.BackgroundHeight);
                var jpgStream = BitmapUtils.ConvertBitmapToJpg(newBmp, 90);
                
			    FileDomain.AllBytes = BitmapUtils.StreamToBytes(jpgStream);

                origBmp.Dispose();
                cutBmp.Dispose();
                newBmp.Dispose();
                jpgStream.Dispose();
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

	    private void UpdatePicSaved(ObjectId tripIdObj, bool state)
	    {
            var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
            var update = DB.U<TripEntity>().Set(p => p.HasBigPicture, state);

            DB.UpdateAsync(filter, update);
        }

	    private void DeleteOldPicture(ObjectId tripIdObj, string tripDir)
	    {
            var trip = DB.C<TripEntity>().First(u => u.id == tripIdObj);
            
            if (trip.HasBigPicture)
            {
                var pathToDelete = FileDomain.Storage.Combine(tripDir, TripFileConstants.BigPicNameExt);
                bool fileExists = FileDomain.Storage.FileExists(pathToDelete);
                if (fileExists)
                {
                    FileDomain.Storage.DeleteFile(pathToDelete);
                }
            }
        }

	}
}