using System;
using System.Collections.Specialized;
using MongoDB.Bson;
using MongoDB.Driver;
using System.Linq;
using System.Net;
using System.Text;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
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