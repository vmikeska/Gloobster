using Gloobster.Common.CommonEnums;

namespace Gloobster.DomainModelsCommon.DO
{
	public class WriteFilePartDO
	{
		public string UserId { get; set; }
		public string Data { get; set; }
		public FilePartType FilePart { get; set; }
		public string FileName { get; set; }

		public string CustomFileName { get; set; }
		public string FileLocation { get; set; }
	}
}