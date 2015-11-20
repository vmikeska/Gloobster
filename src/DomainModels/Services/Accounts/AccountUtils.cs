using System;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Linq;

namespace Gloobster.DomainModels.Services.Accounts
{
	public class AccountUtils
	{
		public static string GeneratePassword()
		{
			return "Password";
		}

		//todo: implement
		public static string DownloadAndStoreTheProfilePicture(string url)
		{
			return "NotImplemented";
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