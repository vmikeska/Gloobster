using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
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
		[Authorize]
		public IActionResult Post([FromBody] FileRequest request)
		{
			var fileLocation = "tpf";
			
			var tripId = request.customId;
			var tripIdObj = new ObjectId(tripId);

			FileDomain.OnFileSaved += (sender, args) =>
			{
				var argsObj = (OnFileSavedArgs)args;

				var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
				var update = DB.U<TripEntity>().Set(p => p.Picture, argsObj.FileName);

				DB.UpdateAsync(filter, update);				
			};

			FileDomain.OnBeforeCreate += (sender, args) =>
			{
				var trip = DB.C<TripEntity>().First(u => u.id == tripIdObj);

				bool fileExists1 = (trip.Picture != null);
				if (fileExists1)
				{
					var pathToDelete = FileDomain.Storage.Combine(fileLocation, trip.Picture);
					bool fileExists2 = FileDomain.Storage.FileExists(pathToDelete);
					if (fileExists2)
					{
						FileDomain.Storage.DeleteFile(pathToDelete);
					}
				}
			};

			var filePartDo = new WriteFilePartDO
			{
				Data = request.data,
				UserId = UserId,
				FileName = request.fileName,
				FilePart = request.filePartType,
				CustomFileName = tripId,
				FileLocation = fileLocation,
				FileType = request.type
			};

			FileDomain.WriteFilePart(filePartDo);
			
			return new ObjectResult(null);
		}

	}
}