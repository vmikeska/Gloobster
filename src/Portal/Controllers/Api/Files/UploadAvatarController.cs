using System.Linq;
using System.Threading;
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
		public IFilesDomain FileDomain { get; set; }

		public UploadAvatarController(IFilesDomain filesDomain, IDbOperations db) : base(db)
		{			
			FileDomain = filesDomain;
		}

		[HttpPost]
		[Authorize]
		public IActionResult Post([FromBody] FileRequest request, string userId)
		{
			FileDomain.OnFileSaved += (sender, args) =>
			{
				var argsObj = (OnFileSavedArgs) args;
				
				var userIdObj = new ObjectId(userId);
				var portalUser = DB.C<PortalUserEntity>().First(u => u.id == userIdObj);
				portalUser.ProfileImage = argsObj.FileName;
				DB.ReplaceOneAsync(portalUser);				
			};

			var filePartDo = new WriteFilePartDO
			{
				Data = request.data,
				UserId = userId,
				FileName = request.fileName,
				FilePart = request.filePartType,
				CustomFileName = userId,
				FileLocation = "Avatars"
			};

			FileDomain.WriteFilePart(filePartDo);
			
			return new ObjectResult(null);
		}

	}
}