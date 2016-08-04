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
		public List<LatLng> Points { get; set; }
        public string StrokeSize { get; set; }
        public string StrokeColor { get; set; }
        public string StrokeOpacity { get; set; }   
	}

	public class FeatureMarkerDO : FeatureBaseDO
	{
		public int PinSize { get; set; }
		public string PinType { get; set; }
		public string Color { get; set; }
		public LatLng Coord { get; set; }
	}
}
