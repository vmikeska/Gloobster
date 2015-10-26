using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using AzureBlobFileSystem;
using Gloobster.Common;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Microsoft.Dnx.Runtime;
using Microsoft.Net.Http.Headers;

namespace Gloobster.Portal.Controllers.Portal
{
	public class PortalUserController : PortalBaseController
	{
		//https://github.com/pofider/AzureBlobFileSystem
		private IStorageProvider storage;

		private IApplicationEnvironment _hostingEnvironment;

		public PortalUserController(IApplicationEnvironment hostingEnvironment, IDbOperations db) : base(db)
		{
			_hostingEnvironment = hostingEnvironment;
			storage = new FileSystemStorageProvider();
		}

		[HttpPost]
		public IActionResult ReceiveFileBlob()
		{
			string path = Path.Combine(_hostingEnvironment.ApplicationBasePath, "test.pdf");

			string requestData = GetBaseRequestData();

			var requestParams = requestData.Split(',');
			string dataCaption = requestParams[0];
			string base64Data = requestParams[1];

			var bytes = Convert.FromBase64String(base64Data);
			using (var fileStream = new FileStream(path, FileMode.Append))
			{
				fileStream.Write(bytes, 0, bytes.Length);
				fileStream.Flush();
			}

			return new ObjectResult(true);
		}

		//zaloha
		//[HttpPost]
		//public void ReceiveFileBlob()
		//{
		//	string path = Path.Combine(_hostingEnvironment.ApplicationBasePath, "test.pdf");

		//	string requestData = GetBaseRequestData();

		//	var requestParams = requestData.Split(',');
		//	string dataCaption = requestParams[0];
		//	string base64Data = requestParams[1];

		//	var bytes = Convert.FromBase64String(base64Data);
		//	using (var fileStream = new FileStream(path, FileMode.Create))
		//	{
		//		fileStream.Write(bytes, 0, bytes.Length);
		//		fileStream.Flush();
		//	}
		//}

		public string GetBaseRequestData()
		{
			string request = "";
			using (StreamReader reader2 = new StreamReader(Context.Request.Body))
			{
				request = reader2.ReadToEnd();
			}

			return request;
		}

	




		public IActionResult Detail()
		{
			return View();
		}

		public IActionResult Settings()
		{
			return View();
		}
		
		[HttpPost]
		public async Task<IActionResult> UploadProfilePicture(IList<IFormFile> files)
		{
			

			foreach (var file in files)
			{
				var fileName = ContentDispositionHeaderValue
					.Parse(file.ContentDisposition)
					.FileName
					.Trim('"'); // FileName returns "fileName.ext"(with double quotes) in beta 3

				//var filePath = _hostingEnvironment.ApplicationBasePath + "\\wwwroot\\" + fileName;
				//await file.SaveAsAsync(filePath);

				Stream fileStream = file.OpenReadStream();

				if (storage.FileExists(storage.Combine("Avatars", fileName)))
				{
					storage.DeleteFile(storage.Combine("Avatars", fileName));
				}

				using (var writer = new StreamWriter(storage.CreateFile(storage.Combine("Avatars", fileName)).OpenWrite()))
				{
					writer.Write(fileStream);
				}

				using (var reader = new StreamReader(storage.GetFile(storage.Combine("Avatars", fileName)).OpenRead()))
				{
					var pic = reader.ReadToEnd();
				}


			}

			return RedirectToAction("Settings"); // PRG
		}
	}

	public class FileRequest
	{
		public string fileData { get; set; }
    }
}
