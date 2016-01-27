using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AzureBlobFileSystem;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Auth;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.DomainModels
{
	//https://github.com/pofider/AzureBlobFileSystem
	public class FilesDomain: IFilesDomain
	{
		public IDbOperations DB { get; set; }
		public ILogger Log { get; set; }
		public IStorageProvider Storage { get; set; }
		
		public string TargetDirectory { get; set; }
		public string OriginaFileName { get; set; }
		public string CustomFileName { get; set; }
		public string UserId { get; set; }
		public string FileType { get; set; }

		public event EventHandler OnFileSaved = delegate { };
		public event EventHandler OnBeforeCreate = delegate { };
		
		public const string TempFolder = "tempfolder";

		private string TempFolderPath => Storage.Combine(TempFolder, UserId);
		
		public Stream GetFile(string fileDirectory, string fileName)
		{
		    try
		    {
                
                string storageFilePath = Storage.Combine(fileDirectory, fileName);
                
                var file = Storage.GetFile(storageFilePath);                
                var stream = file.OpenRead();
                Log.Debug("GetFileLog: after get");
                return stream;
		    }
		    catch (Exception exc)
		    {
		        Log.Error("GetFileLog: " + exc.Message);
		        throw;
		    }
		}

		public void DeleteFile(string filePath)
		{
			Storage.DeleteFile(filePath);			
		}

		public void WriteFilePart(WriteFilePartDO filePart)
		{
			try
			{
				UserId = filePart.UserId;
				TargetDirectory = filePart.FileLocation;
				OriginaFileName = filePart.FileName;
				CustomFileName = filePart.CustomFileName;
				FileType = filePart.FileType;

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
			catch (Exception exc)
			{
				Log.Error($"Exception: {exc.Message}");
				throw;
			}
		}

	    public async Task<bool> ChangeFilePublic(string tripId, string fileId, bool state)
	    {
	        var tripIdObj = new ObjectId(tripId);
	        var fileIdObj = new ObjectId(fileId);

            var f = DB.F<TripEntity>().Eq(p => p.id, tripIdObj) 
                & DB.F<TripEntity>().Eq("FilesPublic.File_id", fileIdObj);
            var u = DB.U<TripEntity>().Set("FilesPublic.$.IsPublic", state);
            var res = await DB.UpdateAsync(f, u);
            
	        return res.ModifiedCount == 1;
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

			OnBeforeCreate.Invoke(this, null);

			//var userIdObj = new ObjectId(UserId);
			//var portalUser = DB.C<PortalUserEntity>().First(u => u.id == userIdObj);

			//var pathToDelete = Storage.Combine(TargetDirectory, portalUser.ProfileImage);
			//bool fileExists = Storage.FileExists(pathToDelete);
			//if (fileExists)
			//{				
			//	Storage.DeleteFile(pathToDelete);
			//}

			var inputFileStream = Storage.CreateFile(targetFilePath).OpenWrite();			
			using (var writer = new BinaryWriter(inputFileStream))
			{
				writer.Write(allBytes);
				writer.Flush();					
			}

			var onFileSavedArgs = new OnFileSavedArgs
			{
				FileName = fileName,
				Directory = TargetDirectory,
				FileType = FileType
			};
			OnFileSaved.Invoke(this, onFileSavedArgs);
		}
		
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
			
			//CreatePathIfNotExists(TempFolder);

			var filePath = Storage.Combine(TempFolderPath, newFilePartNo.ToString());

			var fileStream = Storage.CreateFile(filePath).OpenWrite();
			using (var writer = new StreamWriter(fileStream))
			{			
				writer.Write(data);		
			}		
		}
        
		private void CleanFilePartsCache()
		{
			Log.Debug("FIDO: before files listed");
			try
			{
				//Storage.
				var files = Storage.ListFiles(TempFolderPath).ToList();
				Log.Debug("FIDO: files listed");
				files.ForEach(f => Storage.DeleteFile(f.GetPath()));
				Log.Debug("FIDO: files delted");
			}
			catch (Exception exc)
			{
				Log.Debug("FIDO: exception: " + exc.Message);
			}
		}

		private class DataObj
		{
			public string Data;
			public string Metadata;
		}
	}

	public class OnFileSavedArgs : EventArgs
	{
		public string Directory { get; set; }
		public string FileName { get; set; }
		public string FileType { get; set; }
	}
}