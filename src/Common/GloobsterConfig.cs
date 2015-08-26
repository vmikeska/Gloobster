using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gloobster.Common
{
	public interface IGloobsterConfig
	{
		string MongoConnectionString { get; set; }
	}

	public class GloobsterConfig : IGloobsterConfig
	{
		public string MongoConnectionString { get; set; }
	}
}
