using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.Files
{
	public class TripPhotoController : BaseApiController
	{		
		public FilesDomain FileDomain { get; set; }

		public TripPhotoController(IFilesDomain filesDomain, IDbOperations db) : base(db)
		{			
			FileDomain = (FilesDomain)filesDomain;
		}

		[HttpPost]
		[Authorize]
		public IActionResult Post([FromBody] FileRequest request, string userId)
		{
			var fileLocation = "TripProfilePhoto";

			var userIdObj = new ObjectId(userId);

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

				var pathToDelete = FileDomain.Storage.Combine(fileLocation, trip.Picture);
				bool fileExists = FileDomain.Storage.FileExists(pathToDelete);
				if (fileExists)
				{
					FileDomain.Storage.DeleteFile(pathToDelete);
				}
			};

			var filePartDo = new WriteFilePartDO
			{
				Data = request.data,
				UserId = userId,
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