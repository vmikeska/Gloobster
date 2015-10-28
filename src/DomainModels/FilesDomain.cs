using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AzureBlobFileSystem;
using Gloobster.Common.CommonEnums;
using Gloobster.DomainModelsCommon.DO;
using Gloobster.DomainModelsCommon.Interfaces;
using Microsoft.AspNet.Hosting;
using Microsoft.Dnx.Runtime;

namespace Gloobster.DomainModels
{
	public class FilesDomain: IFilesDomain
	{

		public FilesDomain()
		{
			var envPath = @"C:\S\Gloobster\src\Portal\wwwroot";
			var basePath = Path.Combine(envPath, "FileRepository");
			Storage = new FileSystemStorageProvider(basePath);			
		}

		public IStorageProvider Storage { get; set; }

		public string TargetDirectory { get; set; }
		public string TargetFileName { get; set; }
		public string UserId { get; set; }

		public void WriteFilePart(WriteFilePartDO filePart)
		{
			UserId = filePart.UserId;
			TargetDirectory = "Test";
			TargetFileName = filePart.FileName;

			var dataObj = SplitData(filePart.Data);
			
			if (filePart.FilePart == FilePartType.First)
			{
				DeleteFilePartsCache();	
				SaveFilePart(dataObj.Data);
			}

			if (filePart.FilePart == FilePartType.Middle)
			{
				SaveFilePart(dataObj.Data);
			}

			if (filePart.FilePart == FilePartType.Last)
			{
				JoinAllFileParts(dataObj.Data);
				DeleteFilePartsCache();
			}
		}

		private DataObj SplitData(string inputData)
		{
			var requestParams = inputData.Split(',');

			var data = new DataObj
			{
				Metadata = requestParams.First(),
				Data = requestParams.Last()
			};

			return data;
		}

		private string FolderName => Storage.Combine("Uploads", UserId);

		private void JoinAllFileParts(string lastData)
		{			
			var stringParts = new List<string>();
			
			var files = Storage.ListFiles(FolderName).OrderBy(f => f.GetName());
			foreach (var file in files)
			{
				string filePath = Storage.Combine(FolderName, file.GetName());
				using (var reader = new StreamReader(Storage.GetFile(filePath).OpenRead()))
				{
					var stringPart = reader.ReadToEnd();
					stringParts.Add(stringPart);                    
				}
			}

			stringParts.Add(lastData);

			var allBytes = stringParts.SelectMany(Convert.FromBase64String).ToArray();
			
			var targetFilePath = Storage.Combine(TargetDirectory, TargetFileName);
			var inputFileStream = Storage.CreateFile(targetFilePath).OpenWrite();			
			using (var writer = new BinaryWriter(inputFileStream))
			{
				writer.Write(allBytes);
				writer.Flush();					
			}
		}
		
		private void SaveFilePart(string data)
		{			
			long newFilePartNo = DateTime.UtcNow.Ticks;

			var filePath = Storage.Combine(FolderName, newFilePartNo.ToString());
					
			using (var writer = new StreamWriter(Storage.CreateFile(filePath).OpenWrite()))
			{			
				writer.Write(data);		
			}		
		}

		private void DeleteFilePartsCache()
		{
			var files = Storage.ListFiles(FolderName).ToList();
			files.ForEach(f => Storage.DeleteFile(f.GetPath()));
		}

		public class DataObj
		{
			public string Data;
			public string Metadata;
		}
	}
}