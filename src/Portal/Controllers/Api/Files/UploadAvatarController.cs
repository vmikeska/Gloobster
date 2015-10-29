using System.Linq;
using System.Threading;
using System.Web.UI.WebControls;
using Gloobster.Common;
using Gloobster.Common.DbEntity.PortalUser;
using Gloobster.DomainModels;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Portal.Controllers.Api.Friends;
using Gloobster.Portal.Controllers.Base;
using Gloobster.Portal.ReqRes.Files;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc;
using Microsoft.Dnx.Runtime;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.Files
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
		public IActionResult Post([FromBody] FileRequest request, string userId)
		{
			var fileLocation = "Avatars";

			var userIdObj = new ObjectId(userId);

			FileDomain.OnFileSaved += (sender, args) =>
			{
				var argsObj = (OnFileSavedArgs) args;
				
				var portalUser = DB.C<PortalUserEntity>().First(u => u.id == userIdObj);
				portalUser.ProfileImage = argsObj.FileName;
				DB.ReplaceOneAsync(portalUser);				
			};

			FileDomain.OnBeforeCreate += (sender, args) =>
			{
				var portalUser = DB.C<PortalUserEntity>().First(u => u.id == userIdObj);

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
				UserId = userId,
				FileName = request.fileName,
				FilePart = request.filePartType,
				CustomFileName = userId,
				FileLocation = fileLocation
			};

			FileDomain.WriteFilePart(filePartDo);
			
			return new ObjectResult(null);
		}

	}
}