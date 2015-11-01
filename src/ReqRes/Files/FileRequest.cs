
using Gloobster.Enums;

namespace Gloobster.ReqRes.Files
{
	public class FileRequest
	{
		public string fileName { get; set; }
		public string data { get; set; }
		public FilePartType filePartType { get; set; }
	}
}