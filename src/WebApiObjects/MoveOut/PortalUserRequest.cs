using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.WebApiObjects.Facebook;

namespace Gloobster.WebApiObjects
{
	public class PortalUserRequest
	{
		public string displayName { get; set; }
		public string password { get; set; }
		public string mail { get; set; }
	}
}
