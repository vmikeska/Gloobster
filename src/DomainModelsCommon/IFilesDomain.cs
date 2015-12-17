using System;
using System.IO;
using AzureBlobFileSystem;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IFilesDomain
	{
		void DeleteFile(string filePath);
        void WriteFilePart(WriteFilePartDO filePart);
		Stream GetFile(string fileDirectory, string fileName);
		event EventHandler OnFileSaved;
		event EventHandler OnBeforeCreate;
		IStorageProvider Storage { get; set; }
	}
}