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
	    Stream GetFile(string filePath);

        event EventHandler OnFileSaved;
		event EventHandler OnBeforeCreate;
		IStorageProvider Storage { get; set; }
	    Task<bool> ChangeFilePublic(string tripId, string fileId, bool state);

	    void CopyFile(string fromFilePath, string toFilePath);

        byte[] AllBytes { get; set; }
	    bool DoNotSave { get; set; }
    }
}