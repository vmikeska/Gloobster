using System.Linq;

using Gloobster.DomainObjects;
using Gloobster.Entities;
using MongoDB.Bson;

namespace Gloobster.Mappers
{
	public static class PortalUserMappers
	{
		public static UserDO ToDO(this UserEntity e)
		{
			if (e == null)
			{
				return null;
			}

			var dObj = new UserDO
			{
				DisplayName = e.DisplayName,				
				UserId = e.User_id.ToString(),
				Gender = e.Gender,								
				FirstName = e.FirstName,
				LastName = e.LastName,
                HasProfileImage = e.HasProfileImage,
				HomeLocation = e.HomeLocation.ToDO(),
				CurrentLocation = e.CurrentLocation.ToDO(),
                Languages = e.Languages,
                DefaultLang = e.DefaultLang,
                BirthYear = e.BirthYear,
                FamilyStatus = e.FamilyStatus,
                Interests = e.Interests,
                ShortDescription = e.ShortDescription,
                Mail = e.Mail
            };
            
			return dObj;
		}

		public static UserEntity ToEntity(this UserDO d)
		{
			if (d == null)
			{
				return null;
			}

			var entity = new UserEntity
			{
				DisplayName = d.DisplayName,
				User_id = new ObjectId(d.UserId),
				Gender = d.Gender,
				FirstName = d.FirstName,
				LastName = d.LastName,
				HasProfileImage = d.HasProfileImage,
				HomeLocation = d.HomeLocation.ToEntity(),
				CurrentLocation = d.CurrentLocation.ToEntity(),
                Languages = d.Languages,
                DefaultLang = d.DefaultLang,
                BirthYear = d.BirthYear,
                FamilyStatus = d.FamilyStatus,
                Interests = d.Interests,
                ShortDescription = d.ShortDescription,
                Mail = d.Mail                
			};
            
			return entity;
		}

	}
}