using MongoDB.Bson.Serialization.Attributes;

namespace Gloobster.Entities
{
	[BsonDiscriminator(RootClass = true)]
	[BsonKnownTypes(typeof(TwitterUserSE), typeof(FacebookUserSE), typeof(GoogleUserSE))]
	public class SpecificsUserBase
	{

	}
}