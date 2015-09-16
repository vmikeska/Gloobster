using System.Runtime.Serialization;

namespace Gloobster.DomainModels
{
	[DataContract]
	public class FacebookPermanentToken
	{
		[DataMember(Name = "access_token")]
		public string AccessToken { get; set; }
		[DataMember(Name = "expires")]
		public int SecondsToExpire { get; set; }
	}
}