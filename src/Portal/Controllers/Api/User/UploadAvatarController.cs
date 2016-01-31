using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.User
{
	public class UploadAvatarController: BaseApiController
	{		
		public FilesDomain FileDomain { get; set; }

		public UploadAvatarController(IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
		{			
			FileDomain = (FilesDomain)filesDomain;
		}

		[HttpPost]
		[AuthorizeAttributeApi]
		public IActionResult Post([FromBody] FileRequest request)
		{
			var fileLocation = "avatars";
			
			FileDomain.OnFileSaved += (sender, args) =>
			{
				var argsObj = (OnFileSavedArgs) args;

				var filter = DB.F<PortalUserEntity>().Eq(p => p.id, UserIdObj);
				var update = DB.U<PortalUserEntity>().Set(p => p.ProfileImage, argsObj.FileName);
				DB.UpdateAsync(filter, update);				
			};

			FileDomain.OnBeforeCreate += (sender, args) =>
			{
				var portalUser = DB.C<PortalUserEntity>().First(u => u.id == UserIdObj);

				bool hasAlreadyFile = (portalUser.ProfileImage != null);
				if (hasAlreadyFile)
				{
					var pathToDelete = FileDomain.Storage.Combine(fileLocation, portalUser.ProfileImage);
								
					bool fileExists = FileDomain.Storage.FileExists(pathToDelete);
					if (fileExists)
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
				CustomFileName = UserId,
				FileLocation = fileLocation,
				FileType = request.type
			};

			FileDomain.WriteFilePart(filePartDo);
			
			return new ObjectResult(null);
		}

	}
}