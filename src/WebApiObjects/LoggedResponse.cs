using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gloobster.WebApiObjects
{
    public class LoggedResponse
    {
		public string encodedToken { get; set; }
		public string status { get; set; }
    }
}
