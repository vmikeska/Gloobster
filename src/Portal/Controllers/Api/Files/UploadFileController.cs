using System.Threading;
using Gloobster.Common;
using Gloobster.DomainModels;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Gloobster.Portal.Controllers.Api.Friends;
using Gloobster.Portal.ReqRes.Files;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc;
using Microsoft.Dnx.Runtime;

namespace Gloobster.Portal.Controllers.Api.Files
{
	public class UploadFileController : BaseApiController
	{		
		public IFilesDomain FileDomain { get; set; }

		public UploadFileController(IFilesDomain filesDomain, IDbOperations db) : base(db)
		{			
			FileDomain = filesDomain;
		}

		[HttpPost]
		[Authorize]
		public IActionResult Post([FromBody] FileRequest request, string userId)
		{			
			
			var filePartDo = new WriteFilePartDO
			{
				Data = request.data,
				UserId = userId,
				FileName = request.fileName,
				FilePart = request.filePartType
			};

			FileDomain.WriteFilePart(filePartDo);
			
			return new ObjectResult(null);
		}

	}
}