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

			foreach (var feature in config.Features)
			{
				if (feature is FeaturePathDO)
				{
					var fRes = BuildPathFeature(feature as FeaturePathDO);					
					urlParams.Add(fRes);
				}				
			}

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
			var pathDef = "path-4+026-0.75";

			var encodedPath = GooglePoints.Encode(feature.Points.Values);
			var encodedPathHttpEncoded = HttpUtility.UrlEncode(encodedPath);
			return $"{pathDef}({encodedPathHttpEncoded})";
		}
		
	}
}