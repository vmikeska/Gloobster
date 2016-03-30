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

        public static void SaveProfilePicture(string data, string contentType, string userId, IFilesDomain fileDomain, IDbOperations db)
        {
            try
            {
                fileDomain.OnFileSaved += (sender, args) =>
                {
                    var argsObj = (OnFileSavedArgs)args;

                    //var userIdObj = new ObjectId(userId);
                    //var filter = db.F<UserEntity>().Eq(p => p.id, userIdObj);
                    //var update = db.U<UserEntity>().Set(p => p.ProfileImage, argsObj.FileName);
                    //db.UpdateAsync(filter, update);
                };

                var filePart = new WriteFilePartDO
                {
                    Data = data,
                    UserId = userId,
                    FileLocation = "avatars",
                    FilePart = FilePartType.Last,
                    FileType = contentType,
                    CustomFileName = userId,
                    FileName = "any.jpg"
                };

                fileDomain.WriteFilePart(filePart);
            }
            catch (Exception exc)
            {
                //todo: log
            }
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