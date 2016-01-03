using System;
using System.Collections.Specialized;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Linq;
using System.Net;
using System.Text;
using Hammock.Serialization;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class DownloadPictureResult
	{
		public string Data { get; set; }
		public string ContentType { get; set; }
	}

	public class AccountUtils
	{
		public static string GeneratePassword()
		{
			return "Password";
		}
		
		public static DownloadPictureResult DownloadPicture(string url)
		{
			var client = new WebClient();
			var bytes = client.DownloadData(url);
			var base64 = Convert.ToBase64String(bytes);

			return new DownloadPictureResult
			{
				Data = base64,
				ContentType = client.ResponseHeaders["Content-Type"]
			};
		}

		public static string TryExtractFirstName(string fullName)
		{
			var prms = fullName.Split(' ');
			if (prms.Length < 2)
			{
				return string.Empty;
			}

			return prms.First();
		}

		public static string TryExtractLastName(string fullName)
		{
			var prms = fullName.Split(' ');
			if (prms.Length < 2)
			{
				return string.Empty;
			}

			return prms.Last();
		}
		

	}
}