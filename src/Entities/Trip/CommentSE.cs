using System;
using MongoDB.Bson;

namespace Gloobster.Entities.Trip
{
	public class CommentSE
	{
		public ObjectId User_id { get; set; }
		public DateTime PostDate { get; set; }
		public string Text { get; set; }
	}
}