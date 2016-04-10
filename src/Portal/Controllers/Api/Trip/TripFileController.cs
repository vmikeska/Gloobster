using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.DomainObjects;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Newtonsoft.Json;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class TripFileController : BaseApiController
	{		
		public IFilesDomain FileDomain { get; set; }		

		public TripFileController(IFilesDomain filesDomain,ILogger log,  IDbOperations db) : base(log, db)
		{			
			FileDomain = filesDomain;
			Log = log;
		}
		
		[HttpPost]
		[AuthorizeApi]
		public IActionResult Post([FromBody] TripFileRequest request)
		{			
			var tripIdObj = new ObjectId(request.tripId);
			var fileLocation = FileDomain.Storage.Combine(TripFileConstants.TripFilesDir, request.tripId);
			var savedFileName = Guid.NewGuid().ToString().Replace("-", string.Empty);
			
			FileDomain.OnFileSaved += (sender, args) =>
			{			
				var argsObj = (OnFileSavedArgs) args;
				
				var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);
				if (trip == null)
				{
					//throw bad trip id
					throw new Exception();
				}

				//todo: check rights to upload file
				
				var newFile = new FileSE
				{
                    id = ObjectId.GenerateNewId(),
					User_id = UserIdObj,
					OriginalFileName = request.fileName,
					SavedFileName = argsObj.FileName,
					Type = argsObj.FileType,
					EntityId = request.entityId,
					EntityType = request.entityType
				};

			    var newPublic = new FilePublicSE
			    {
			        File_id = newFile.id,
			        IsPublic = false
			    };

				var f1 = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
				var u1 = DB.U<TripEntity>().Push(p => p.Files, newFile);
				DB.UpdateAsync(f1, u1);

                var f2 = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
                var u2 = DB.U<TripEntity>().Push(p => p.FilesPublic, newPublic);
                DB.UpdateAsync(f2, u2);
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

            NewFileResponse response = null;

			//todo: move to event above ?
			if (request.filePartType == FilePartType.Last)
			{
				var trip = DB.FOD<TripEntity>(t => t.id == tripIdObj);
			    response = GetResponse(trip);
			}

			return new ObjectResult(response);
		}

		[HttpDelete]
		[AuthorizeApi]
		public async Task<IActionResult> Delete(string fileId, string tripId)
		{
			var tripIdObj = new ObjectId(tripId);			
			var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

			if (trip == null)
			{
				//throw not exists
				throw new NullReferenceException();
			}

			NewFileResponse filesResponse = null;
            if (trip.Files != null)
			{
				//todo: check rights				

			    var id = new ObjectId(fileId);
                var fileToDelete = trip.Files.FirstOrDefault(f => f.id == id);
			    var publicInfoToDelete = trip.FilesPublic.FirstOrDefault(f => f.File_id == id);

				if (fileToDelete == null)
				{
					//thorw not found
					throw new Exception();
				}

				var f1 = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
				var u1 = DB.U<TripEntity>().Pull(p => p.Files, fileToDelete);
				await DB.UpdateAsync(f1, u1);

                var f2 = DB.F<TripEntity>().Eq(p => p.id, tripIdObj);
                var u2 = DB.U<TripEntity>().Pull(p => p.FilesPublic, publicInfoToDelete);
                await DB.UpdateAsync(f2, u2);

                var fileLocation = Path.Combine(TripFileConstants.TripFilesDir, tripId, fileToDelete.SavedFileName);
				FileDomain.DeleteFile(fileLocation);

				trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);
				filesResponse = GetResponse(trip);
			}
			
			return new ObjectResult(filesResponse);
		}

	    private NewFileResponse GetResponse(TripEntity trip)
	    {
            var response = new NewFileResponse
            {
                files = trip.Files.Select(f => f.ToResponse()).ToList(),
                filesPublic = trip.FilesPublic.Select(f => f.ToResponse()).ToList()
            };
	        return response;
	    }

	}
}