using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Airports
{
	public class QueryBuilder
	{
		public Dictionary<string, string> Parameters = new Dictionary<string, string>();
		private bool _withQuestionMark = false;
		private string _endpoint;
		private string _baseUrl;
		private bool _encodeParams = false;

		public string Build()
		{
			var result = string.Empty;

			if (!string.IsNullOrEmpty(_baseUrl))
			{
				result = _baseUrl;
			}

			if (!string.IsNullOrEmpty(_endpoint))
			{
				//todo: path connecting logic
				result += _endpoint;
			}

			var pairedParams = Parameters.Select(p => $"{p.Key}={(_encodeParams ? HttpUtility.UrlEncode(p.Value) : p.Value)}");
			var queryStr = string.Join("&", pairedParams);

			bool hasParams = Parameters.Any();
			if (hasParams)
			{
				result += "?";
				result += queryStr;
			}

			return result;
		}

		public QueryBuilder EncodeParams()
		{
			_encodeParams = true;
			return this;
		}

		public QueryBuilder Param(string key, string value)
		{
			Parameters.Add(key, value);
			return this;
		}

		public QueryBuilder BaseUrl(string baseUrl)
		{
			_baseUrl = baseUrl;
			return this;
		}


		public QueryBuilder Endpoint(string endpoint)
		{
			_endpoint = endpoint;
			return this;
		}

	}
}