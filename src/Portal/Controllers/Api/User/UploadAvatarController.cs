using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Microsoft.AspNet.Mvc;

namespace Gloobster.Portal.Controllers.Api.User
{
	public class UploadAvatarController: BaseApiController
	{		
		public FilesDomain FileDomain { get; set; }

		public UploadAvatarController(IFilesDomain filesDomain, IDbOperations db) : base(db)
		{			
			FileDomain = (FilesDomain)filesDomain;
		}

		[HttpPost]
		[Authorize]
		public IActionResult Post([FromBody] FileRequest request)
		{
			var fileLocation = "Avatars";
			
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

				var pathToDelete = FileDomain.Storage.Combine(fileLocation, portalUser.ProfileImage);
				bool fileExists = FileDomain.Storage.FileExists(pathToDelete);
				if (fileExists)
				{
					FileDomain.Storage.DeleteFile(pathToDelete);
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