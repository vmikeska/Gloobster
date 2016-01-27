using Gloobster.DomainObjects;
using Gloobster.Entities;

namespace Gloobster.Mappers
{
	public static class NotificationMappers
	{
		public static NotificationSE ToEntity(this NotificationDO d)
		{
			var e = new NotificationSE
			{				
				Status = d.Status,
				Content = d.Content,
				ContentType = d.ContentType,
				Title = d.Title,
                Link = d.Link,
                LinkText = d.LinkText
			};

			return e;
		}
	}
}