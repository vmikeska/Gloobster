using System.Collections.Generic;
using System.Linq;

namespace Gloobster.DomainModels.Services.GeonamesService
{
	public class LinkQueryBuilder
	{
		private string UrlBase;
		private string EndpointName;
		private Dictionary<string, object> Params = new Dictionary<string, object>();

		public LinkQueryBuilder Url(string url)
		{
			UrlBase = url;
			return this;
		}

		public LinkQueryBuilder Endpoint(string endpoint)
		{
			EndpointName = endpoint;
			return this;
		}

		public LinkQueryBuilder Param(string name, object value)
		{
			Params.Add(name, value);
			return this;
		}

		public string Build()
		{
			var prmsStr = string.Join("/", Params.Select(p => $"{p.Key}/{p.Value}"));

			var link = string.Join("/", new [] { UrlBase, EndpointName, prmsStr });
			return link;
		}
	}
}