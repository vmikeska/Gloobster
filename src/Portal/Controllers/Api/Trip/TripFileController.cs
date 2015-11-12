using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripFileController : BaseApiController
	{		
		public FilesDomain FileDomain { get; set; }

		public TripFileController(IFilesDomain filesDomain, IDbOperations db) : base(db)
		{			
			FileDomain = (FilesDomain)filesDomain;
		}
		
		[HttpPost]
		[Authorize]
		public IActionResult Post([FromBody] TripFileRequest request)
		{			
			var tripIdObj = new ObjectId(request.tripId);
			var fileLocation = Path.Combine("Trips", request.tripId);
			var savedFileName = Guid.NewGuid().ToString().Replace("-", string.Empty);
			
			FileDomain.OnFileSaved += (sender, args) =>
			{
				var argsObj = (OnFileSavedArgs) args;
				
				var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

				if (trip == null)
				{
					//throw bad trip id
					throw new Exception();
				}

				//todo: check rights to upload file
				
				var newFile = new FileSE
				{
					PortalUser_id = UserIdObj,
					OriginalFileName = request.fileName,
					SavedFileName = argsObj.FileName,
					Type = argsObj.FileType,
					EntityId = request.entityId,
					EntityType = request.entityType
				};

				var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
				var update = DB.U<TripEntity>().Push(p => p.Files, newFile);
				DB.UpdateAsync(filter, update);		
			};

			var filePartDo = new WriteFilePartDO
			{
				Data = request.data,
				UserId = UserId,
				FileName = request.fileName,
				FilePart = request.filePartType,
				CustomFileName = savedFileName,
				FileLocation = fileLocation,
				FileType = request.type
			};

			FileDomain.WriteFilePart(filePartDo);

			List<FileResponse> response = null;

			if (request.filePartType == FilePartType.Last)
			{
				var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

				response = GetResponse(trip.Files);
			}
			
			return new ObjectResult(response);
		}

		[HttpDelete]
		[Authorize]
		//, string entityId
		public async Task<IActionResult> Delete(string fileId, string tripId)
		{
			var tripIdObj = new ObjectId(tripId);			
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			if (trip == null)
			{
				//throw not exists
				throw new NullReferenceException();
			}

			List<FileResponse> filesResponse = null;
            if (trip.Files != null)
			{
				//todo: check rights				
				var fileToDelete = trip.Files.FirstOrDefault(f => f.SavedFileName == fileId);

				if (fileToDelete == null)
				{
					//thorw not found
					throw new Exception();
				}

				var filter = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
				var update = DB.U<TripEntity>().Pull(p => p.Files, fileToDelete);
				await DB.UpdateAsync(filter, update);
				
				var fileLocation = Path.Combine("Trips", tripId, fileToDelete.SavedFileName);
				FileDomain.DeleteFile(fileLocation);

				trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

				filesResponse = GetResponse(trip.Files);
			}
			
			return new ObjectResult(filesResponse);
		}

		private List<FileResponse> GetResponse(List<FileSE> files, string entityId = null)
		{
			List<FileResponse> response;

			//if (string.IsNullOrEmpty(entityId))
			//{
				response = files.Select(f => f.ToResponse()).ToList();
			//}
			//else
			//{
			//	response = files.Where(f => f.EntityId == entityId).Select(f => f.ToResponse()).ToList();
			//}

			return response;			
		}

		

	}
}