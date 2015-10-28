using System;
using Gloobster.DomainModelsCommon.DO;
using Microsoft.AspNet.Hosting;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IFilesDomain
	{
		event EventHandler OnFileSaved;
        void WriteFilePart(WriteFilePartDO filePart);
	}
}