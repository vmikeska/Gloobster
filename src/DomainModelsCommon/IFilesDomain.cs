using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IFilesDomain
	{
		void DeleteFile(string filePath);
        void WriteFilePart(WriteFilePartDO filePart);		
	}
}