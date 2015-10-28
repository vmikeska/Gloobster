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
		public const string EnvRoot = @"C:\S\Gloobster\src\Portal\wwwroot";
		public const string RepositoryDirectory = "FileRepository";
		public const string TempFolder = "TempFolder";

		private string TempFolderPath => Storage.Combine(TempFolder, UserId);

		public FilesDomain()
		{			
			var basePath = Path.Combine(EnvRoot, RepositoryDirectory);
			Storage = new FileSystemStorageProvider(basePath);			
		}

		public IStorageProvider Storage { get; set; }

		public string TargetDirectory { get; set; }
		public string OriginaFileName { get; set; }
		public string CustomFileName { get; set; }
		public string UserId { get; set; }

		public void WriteFilePart(WriteFilePartDO filePart)
		{
			UserId = filePart.UserId;
			TargetDirectory = filePart.FileLocation;
			OriginaFileName = filePart.FileName;
			CustomFileName = filePart.CustomFileName;

			var dataObj = SplitData(filePart.Data);
			
			if (filePart.FilePart == FilePartType.First)
			{
				CleanFilePartsCache();	
				SaveFilePart(dataObj.Data);
			}

			if (filePart.FilePart == FilePartType.Middle)
			{
				SaveFilePart(dataObj.Data);
			}

			if (filePart.FilePart == FilePartType.Last)
			{
				JoinAllFileParts(dataObj.Data);
				CleanFilePartsCache();
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

		

		private void JoinAllFileParts(string lastData)
		{			
			var stringParts = new List<string>();
			
			var files = Storage.ListFiles(TempFolderPath).OrderBy(f => f.GetName());
			foreach (var file in files)
			{
				string filePath = Storage.Combine(TempFolderPath, file.GetName());
				using (var reader = new StreamReader(Storage.GetFile(filePath).OpenRead()))
				{
					var stringPart = reader.ReadToEnd();
					stringParts.Add(stringPart);                    
				}
			}

			stringParts.Add(lastData);

			var allBytes = stringParts.SelectMany(Convert.FromBase64String).ToArray();



			string fileName = BuildFileName();

			var targetFilePath = Storage.Combine(TargetDirectory, fileName);
			var inputFileStream = Storage.CreateFile(targetFilePath).OpenWrite();			
			using (var writer = new BinaryWriter(inputFileStream))
			{
				writer.Write(allBytes);
				writer.Flush();					
			}

			var onFileSavedArgs = new OnFileSavedArgs
			{
				FileName = fileName,
				Directory = TargetDirectory
			};
			OnFileSaved.Invoke(this, onFileSavedArgs);
		}

		public event EventHandler OnFileSaved = delegate {  };


		private string BuildFileName()
		{
			bool hasCustomName = !string.IsNullOrEmpty(CustomFileName);
			if (hasCustomName)
			{
				var fileExt = Path.GetExtension(OriginaFileName);
				var fileName = $"{CustomFileName}{fileExt}";
				return fileName;
			}

			return OriginaFileName;
		}

		private void SaveFilePart(string data)
		{			
			long newFilePartNo = DateTime.UtcNow.Ticks;

			var filePath = Storage.Combine(TempFolderPath, newFilePartNo.ToString());
					
			using (var writer = new StreamWriter(Storage.CreateFile(filePath).OpenWrite()))
			{			
				writer.Write(data);		
			}		
		}

		private void CleanFilePartsCache()
		{
			var files = Storage.ListFiles(TempFolderPath).ToList();
			files.ForEach(f => Storage.DeleteFile(f.GetPath()));
		}

		public class DataObj
		{
			public string Data;
			public string Metadata;
		}
	}

	public class OnFileSavedArgs : EventArgs
	{
		public string Directory { get; set; }
		public string FileName { get; set; }
	}
}