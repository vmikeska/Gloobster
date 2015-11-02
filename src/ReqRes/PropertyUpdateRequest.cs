using System.Collections.Generic;

namespace Gloobster.ReqRes
{
	public class PropertyUpdateRequest
	{		
		public string propertyName { get; set; }
		public Dictionary<string, string> values { get; set; }
	}
}