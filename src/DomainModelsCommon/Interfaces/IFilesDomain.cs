using Gloobster.DomainModelsCommon.DO;
using Microsoft.AspNet.Hosting;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IFilesDomain
	{		
		void WriteFilePart(WriteFilePartDO filePart);
	}
}