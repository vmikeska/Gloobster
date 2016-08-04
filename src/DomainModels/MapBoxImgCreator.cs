using System;
using System.Collections.Generic;
using System.Globalization;
using System.Web;
using System.Web.Util;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;

namespace Gloobster.DomainModels
{
	//https://www.mapbox.com/developers/api/static/
	public class MapBoxImgCreator: IMapBoxImgCreator
	{
		public string BuildMapLink(BuildMapConfigDO config, string accessToken)
		{
			var urlParams = new List<string>();

			string veryBaseUrl = $"https://api.mapbox.com/v4/{config.MapId}";
			urlParams.Add(veryBaseUrl);

			var featuresStr = new List<string>();
			foreach (var feature in config.Features)
			{
				string featureStr = string.Empty;
				if (feature is FeaturePathDO)
				{
					featureStr = BuildPathFeature(feature as FeaturePathDO);
					
				}
				if (feature is FeatureMarkerDO)
				{
					featureStr = BuildMarkerFeature(feature as FeatureMarkerDO);
				}
				featuresStr.Add(featureStr);
			}
			urlParams.Add(string.Join(",", featuresStr));

			if (config.AutoFit)
			{
				urlParams.Add("auto");
			}
			else
			{
				string mapCenter = $"{DoubleToStr(config.MapCenter.Lng, 2)},{DoubleToStr(config.MapCenter.Lat, 2)},{config.Zoom}";
				urlParams.Add(mapCenter);				
			}

			string mapSize = $"{config.Width}x{config.Height}.png";
			urlParams.Add(mapSize);

			string link = string.Join("/", urlParams);

			var qb = new QueryBuilder();
			qb.BaseUrl(link)
				.Param("access_token", accessToken);

			string completeLink = qb.Build();
			return completeLink;
		}

		private string DoubleToStr(double number, int decPoints)
		{
			var d2dPoints = Math.Round(number, decPoints);
			var str = d2dPoints.ToString(CultureInfo.InvariantCulture);
			return str;
		}

		private string BuildPathFeature(FeaturePathDO feature)
		{            
            var pathDef = $"path-{feature.StrokeSize}+{feature.StrokeColor}-{feature.StrokeOpacity}";
            
            var encodedPath = GooglePoints.Encode(feature.Points);
			var encodedPathHttpEncoded = HttpUtility.UrlEncode(encodedPath);
			return $"{pathDef}({encodedPathHttpEncoded})";
		}

		private string BuildMarkerFeature(FeatureMarkerDO feature)
		{
			string size;
			switch (feature.PinSize)
			{
				case 1: size = "pin-s"; break;
				case 2: size = "pin-m"; break;
				case 3: size = "pin-l"; break;
				default: size = "pin-l"; break;
			}
			
			return $"{size}-{feature.PinType}+{feature.Color}({DoubleToStr(feature.Coord.Lng, 2)},{DoubleToStr(feature.Coord.Lat, 2)})";
		}
		
	}
}