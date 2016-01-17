using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.ReqRes.PinBoard
{
	public class PinBoardStatRequest
	{
		public DataType dataType { get; set; }
		public DisplayEntity displayEntity { get; set; }

        public bool me { get; set; }
        public bool friends { get; set; }
        public bool everybody { get; set; }

        public string singleFriends { get; set; }
	}    
}