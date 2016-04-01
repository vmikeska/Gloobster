using System.Drawing;
using System.IO;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Wiki;
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
		public IFilesDomain FileDomain { get; set; }
        public IAvatarPhoto AvatarPhoto { get; set; }
        
		public UploadAvatarController(IAvatarPhoto avatarPhoto, IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
		{			
			FileDomain = filesDomain;
		    AvatarPhoto = avatarPhoto;
		}
        
        [HttpPost]
		[AuthorizeApi]
		public IActionResult Post([FromBody] FileRequest request)
		{
			var location = FileDomain.Storage.Combine(AvatarFilesConsts.Location, UserId);
            
            FileDomain.OnFileSaved += (sender, args) =>
            {
                var argsObj = (OnFileSavedArgs)args;

                AvatarPhoto.UpdateFileSaved(UserId);
                
                var originalFile = FileDomain.GetFile(location, argsObj.FileName);
                
                AvatarPhoto.CreateThumbnails(location, originalFile);                
            };

            FileDomain.OnBeforeCreate += (sender, args) =>
			{                
			    AvatarPhoto.DeleteOld(location);             
            };

			var filePartDo = new WriteFilePartDO
			{
				Data = request.data,
				UserId = UserId,
				FileName = request.fileName,
				FilePart = request.filePartType,
				CustomFileName = "original",
				FileLocation = location,
				FileType = request.type
			};

			FileDomain.WriteFilePart(filePartDo);
			
			return new ObjectResult(null);
		}

	}
}