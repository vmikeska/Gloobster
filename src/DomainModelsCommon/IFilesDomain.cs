using System;
using System.IO;
using System.Threading.Tasks;
using AzureBlobFileSystem;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IFilesDomain
	{
		void DeleteFile(string filePath);
	    void DeleteFolder(string folderPath);
        void WriteFilePart(WriteFilePartDO filePart);
		Stream GetFile(string fileDirectory, string fileName);
		event EventHandler OnFileSaved;
		event EventHandler OnBeforeCreate;
		IStorageProvider Storage { get; set; }
	    Task<bool> ChangeFilePublic(string tripId, string fileId, bool state);

        byte[] AllBytes { get; set; }
	    bool DoNotSave { get; set; }
    }
}