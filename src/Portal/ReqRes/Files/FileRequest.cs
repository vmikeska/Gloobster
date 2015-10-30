
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Api.Files;

namespace Gloobster.Portal.ReqRes.Files
{
	public class FileRequest
	{
		public string fileName { get; set; }
		public string data { get; set; }
		public FilePartType filePartType { get; set; }
	}
}