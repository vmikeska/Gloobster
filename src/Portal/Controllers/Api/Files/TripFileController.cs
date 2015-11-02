using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using System.Threading.Tasks;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.ReqRes.Trip;

namespace Gloobster.Portal.Controllers.Api.Files
{
	public class TripFileController : BaseApiController
	{		
		public FilesDomain FileDomain { get; set; }

		public TripFileController(IFilesDomain filesDomain, IDbOperations db) : base(db)
		{			
			FileDomain = (FilesDomain)filesDomain;
		}

		//[HttpGet]
		//[Authorize]
		//public IActionResult Get(string fileId, string tripId, string userId)
		//{
		//	var tripIdObj = new ObjectId(tripId);
		//	var userIdObj = new ObjectId(userId);
		//	var trip = DB.C<TripEntity>().FirstOrDefault(t => t.id == tripIdObj);

		//	if (trip == null)
		//	{
		//		//throw not exists
		//		throw new Exception();
		//	}

		//	if (trip.Files == null)
		//	{
		//		//throw not exists
		//		throw new Exception();
		//	}

		//	//todo: check rights				
		//	var fileToReturn = trip.Files.FirstOrDefault(f => f.SavedFileName == fileId);

		//	if (fileToReturn == null)
		//	{
		//		//thorw not found
		//		throw new Exception();
		//	}

		//	var dir = Path.Combine("Trips", tripId);
		//	var fileStream = FileDomain.GetFile(dir, fileToReturn.SavedFileName);


		//	return File(fileStream, fileToReturn.Type);
		//}

		[HttpPost]
		[Authorize]
		public IActionResult Post([FromBody] FileRequest request, string userId)
		{
			var tripId = request.customId;
			var tripIdObj = new ObjectId(tripId);
			var fileLocation = Path.Combine("Trips", tripId);
			var savedFileName = Guid.NewGuid().ToString().Replace("-", string.Empty);
			var userIdObj = new ObjectId(userId);

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

				if (trip.Files == null)
				{
					trip.Files = new List<FileSE>();
				}

				var newFile = new FileSE
				{
					PortalUser_id = userIdObj,
					OriginalFileName = request.fileName,
					SavedFileName = argsObj.FileName,
					Type = argsObj.FileType
				};

				trip.Files.Add(newFile);
				
				//todo: just update
				DB.ReplaceOneAsync(trip);				
			};

			var filePartDo = new WriteFilePartDO
			{
				Data = request.data,
				UserId = userId,
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
				response = trip.Files.Select(f => f.ToResponse()).ToList();
			}

			return new ObjectResult(response);
		}

		[HttpDelete]
		[Authorize]
		public async Task<IActionResult> Delete(string fileId, string tripId, string userId)
		{
			var tripIdObj = new ObjectId(tripId);
			var userIdObj = new ObjectId(userId);
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
				//todo: delete without update entire entity

				var fileToDelete = trip.Files.FirstOrDefault(f => f.SavedFileName == fileId);

				if (fileToDelete == null)
				{
					//thorw not found
					throw new Exception();
				}

				var fileLocation = Path.Combine("Trips", tripId, fileToDelete.SavedFileName);
				FileDomain.DeleteFile(fileLocation);

				trip.Files.Remove(fileToDelete);
				await DB.ReplaceOneAsync(trip);

				filesResponse = trip.Files.Select(f => f.ToResponse()).ToList();
			}

			

			return new ObjectResult(filesResponse);
		}

		

	}
}