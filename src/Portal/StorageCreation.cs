using System;
using System.IO;
using AzureBlobFileSystem;
using Gloobster.Common;
using Microsoft.WindowsAzure.Storage;
using Serilog;

namespace Gloobster.Portal
{
	public class StorageCreation
	{
		public ILogger Log { get; set; }

		//public StorageCreation(ILogger log)
		//{
		//	Log = log.ForContext(typeof (StorageCreation));
		//}

		public const string RepositoryDirectory = "filerepository";
		
		public IStorageProvider GetInstance(bool isLocal)
		{
			//Log.Debug("CreatingStorage, isLocal: " + isLocal);
			
			if (isLocal)
			{
				var storage = GetLocal();
				return storage;
			}
			else
			{
				var storage = GetAzure();
				return storage;
			}			
		}


		private IStorageProvider GetAzure()
		{
			try
			{
				//Log.Debug("GettingAzureStorage");
				
				var account = CloudStorageAccount.Parse(GloobsterConfig.StorageConnectionString);
				var storage = new AzureBlobStorageProvider(account);
				//Log.Debug("CreatedAzureStorage");

				return storage;
			}
			catch (Exception exc)
			{
				//Log.Error($"AzureStorage: {exc.Message}");
				throw;
			}
		}

		private IStorageProvider GetLocal()
		{
			try
			{
				//Log.Debug("GettingLocalStorage");

				var basePath = Path.Combine(GloobsterConfig.StorageRootDir, RepositoryDirectory);
				var storage = new FileSystemStorageProvider(basePath);
				//Log.Debug("CreatedLocalStorage");

				return storage;
			}
			catch (Exception exc)
			{
				//Log.Error($"LocalStorage: {exc.Message}");
				throw;
			}
		}

	}
}