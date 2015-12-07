using System.Collections.Generic;
using System.Web;
using System.Web.Util;
using Gloobster.Common;

namespace Gloobster.DomainModels
{
	
	public class BuildMapConfig
	{
		public int Width { get; set; }
		public int Height { get; set; }

		public int Zoom { get; set; }

		public LatLng MapCenter { get; set; }

		public string MapId { get; set; }

		public List<FeatureBase> Features { get; set; }
	}

	public class FeatureBase
	{
	}

	public class FeaturePath : FeatureBase
	{
		public Dictionary<int, LatLng> Points { get; set; }
	}

	public class MapBoxImgCreator
	{
		private string BuildPathFeature(FeaturePath feature)
		{
			var pathDef = "path-4+026-0.75";
			
			var encodedPath = GooglePoints.Encode(feature.Points.Values);
			var encodedPathHttpEncoded = HttpUtility.UrlEncode(encodedPath);
			return $"{pathDef}({encodedPathHttpEncoded})";
		}

		
		public string BuildMap(BuildMapConfig config, string accessToken)
		{
			var urlParams = new List<string>();

			string veryBaseUrl = $"https://api.mapbox.com/v4/{config.MapId}";
			urlParams.Add(veryBaseUrl);

			foreach (var feature in config.Features)
			{
				if (feature is FeaturePath)
				{
					var fRes = BuildPathFeature(feature as FeaturePath);					
					urlParams.Add(fRes);
				}				
			}

			string mapCenter = $"{config.MapCenter.Lat},{config.MapCenter.Lng},{config.Zoom}";
			urlParams.Add(mapCenter);

			string mapSize = $"{config.Width}x{config.Height}.png";
			urlParams.Add(mapSize);


			string link = string.Join("/", urlParams);

			var qb = new QueryBuilder();
			qb.BaseUrl(link)
				.Param("access_token", accessToken);

			string completeLink = qb.Build();
			return completeLink;
		}

		

	}
}