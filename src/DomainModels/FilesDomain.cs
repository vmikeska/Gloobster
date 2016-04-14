using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AzureBlobFileSystem;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
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

	    public byte[] AllBytes { get; set; }
        public bool DoNotSave { get; set; }


        public string TargetDirectory { get; set; }
		public string OriginaFileName { get; set; }
		public string CustomFileName { get; set; }
		public string UserId { get; set; }
		public string FileType { get; set; }

		public event EventHandler OnFileSaved = delegate { };
		public event EventHandler OnBeforeCreate = delegate { };
		
		public const string TempFolder = "tempfolder";

		private string TempFolderPath => Storage.Combine(TempFolder, UserId);

	    private bool LogsOn = false;

	    private void WriteLog(string text)
	    {
	        if (LogsOn)
	        {
	            var txt = $"FilesDomain: {text}";
                Log.Debug(txt);
	        }            
        }

		public Stream GetFile(string fileDirectory, string fileName)
		{
		    Stream stream = null;
            try
            {
                WriteLog("getting file");
                
                string storageFilePath = Storage.Combine(fileDirectory, fileName);
                
                var file = Storage.GetFile(storageFilePath);                
                stream = file.OpenRead();
                WriteLog("GetFileLog: after get");
                return stream;
		    }
		    catch (Exception exc)
		    {
		        stream?.Dispose();

                WriteLog("Error get file" + exc.Message);                
		        throw;
		    }
		}

		public void DeleteFile(string filePath)
        {
		    try
		    {
                WriteLog($"Deleting: {filePath}");
                bool fileExists = false;

		        try
		        {

		            if (Storage.FileExists(filePath))
		            {
		                fileExists = true;
		                WriteLog($"Exists");
		            }
		            else
		            {
                        WriteLog($"NotExists");
                    }
                }
		        catch (Exception exc)
		        {
                    WriteLog($"Exists: Exception: {exc.Message}");
                }

		        if (fileExists)
		        {
                    Storage.DeleteFile(filePath);
                }
                
		    }
		    catch (Exception exc)
		    {
                WriteLog("cannot delete file: " + exc.Message);
            }
        }

        public void DeleteFolder(string folderPath)
        {
            try
            {
                Thread.Sleep(10);

                Storage.DeleteFolder(folderPath);
            }
            catch (Exception exc)
            {
                WriteLog("cannot delete folder: " + exc.Message);                
            }            
        }

        public void WriteFilePart(WriteFilePartDO filePart)
		{
			try
			{
                WriteLog("writing file part: " + filePart.FilePart.ToString());

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
                WriteLog("WriteFilePart, Exception : " + exc.Message);
				throw;
			}
		}

        //move out, trip stuff should not be in this common class
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
		    try
		    {
                WriteLog("JoinAllFileParts: enter");

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

		        AllBytes = stringParts.SelectMany(Convert.FromBase64String).ToArray();

		        string fileName = BuildFileName();
		        var targetFilePath = Storage.Combine(TargetDirectory, fileName);

		        OnBeforeCreate.Invoke(this, null);

		        if (!DoNotSave)
		        {
		            using (var inputFileStream = Storage.CreateFile(targetFilePath).OpenWrite())
		            {
		                using (var writer = new BinaryWriter(inputFileStream))
		                {
		                    writer.Write(AllBytes);
		                    writer.Flush();
		                }
		            }
		        }

		        var onFileSavedArgs = new OnFileSavedArgs
		        {
		            FileName = fileName,
		            Directory = TargetDirectory,
		            FileType = FileType,
		            FileSize = decimal.Round(Convert.ToDecimal(AllBytes.Length)/(1024.0m*1024.0m), 3)

		        };
		        OnFileSaved.Invoke(this, onFileSavedArgs);
		    }
		    catch (Exception exc)
		    {
                WriteLog($"JoinAllFileParts: exception: {exc.Message}");
            }
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
		    try
		    {
                WriteLog($"SaveFilePart: start");

                long newFilePartNo = DateTime.UtcNow.Ticks;

                var filePath = Storage.Combine(TempFolderPath, newFilePartNo.ToString());

                using (var fileStream = Storage.CreateFile(filePath).OpenWrite())
                {
                    using (var writer = new StreamWriter(fileStream))
                    {
                        writer.Write(data);
                    }
                }
            }
		    catch (Exception exc)
		    {
                WriteLog($"SaveFilePart: exception: {exc.Message}");
            }            
		}
        
		private void CleanFilePartsCache()
		{
            WriteLog($"CleanFilePartsCache: start: {TempFolderPath}");
			try
			{
                //Thread.Sleep(10);
                //Storage.DeleteFolder(TempFolderPath);

                var filesInFolder = Storage.ListFiles(TempFolderPath);

                foreach (var file in filesInFolder)
                {
                    var path = file.GetPath();
                    DeleteFile(path);
                }

                WriteLog($"CleanFilePartsCache: deleted: {TempFolderPath}");
                
                //var files = Storage.ListFiles(TempFolderPath).ToList();
                //Log.Debug("FIDO: files listed");
                //files.ForEach(f => DeleteFile(f.GetPath()));
                //Log.Debug("FIDO: files delted");
            }
			catch (Exception exc)
			{
                WriteLog("CleanFilePartsCache: exception: " + exc.Message);
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
        public decimal FileSize { get; set; }
	}
}