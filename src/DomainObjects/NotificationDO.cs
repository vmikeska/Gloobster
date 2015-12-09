using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
	public class NotificationDO
	{
		public string Id { get; set; }
		public string UserId { get; set; }
		public string Title { get; set; }
		public string Content { get; set; }
		public ContentType ContentType { get; set; }
		public NotificationStatus Status { get; set; }
	}
}
