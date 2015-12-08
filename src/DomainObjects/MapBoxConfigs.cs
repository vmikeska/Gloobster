using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;

namespace Gloobster.DomainObjects
{
	public class BuildMapConfigDO
	{
		public int Zoom { get; set; }
		public LatLng MapCenter { get; set; }
		public bool AutoFit { get; set; }


		public int Width { get; set; }
		public int Height { get; set; }
		
		public string MapId { get; set; }

		public List<FeatureBaseDO> Features { get; set; }
	}

	public class FeatureBaseDO
	{
	}

	public class FeaturePathDO : FeatureBaseDO
	{
		public Dictionary<int, LatLng> Points { get; set; }
	}
}
