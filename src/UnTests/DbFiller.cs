using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using Xunit;
namespace Gloobster.UnitTests
{

	public class ParamsBuilder
	{
		public Dictionary<string, object> Params = new Dictionary<string, object>();

		public ParamsBuilder AddParam(string key, object value)
		{
			Params.Add(key,value);

			return this;
		}

		public string BuildQuery(bool withQuestionMark = true, string separator = "&", string quotedChar = "")
		{
			
            var query = string.Join(separator, Params.Select(i => $"{i.Key}={ quotedChar + Uri.EscapeDataString(i.Value.ToString()) + quotedChar}"));

			if (withQuestionMark)
			{
				query = "?" + query;
			}

			return query;
		}
	}

	public class DbFiller: TestBase
	{
		//[Fact]
		//public async void TestTheThing4()
		//{
		//	var _consumerKey = "i4mKurz5tQfjEoiKyVsXVQrCx";
		//	string _consumerSecret = "prADL3Do7ZBckqJ7oaKylNhTkHXIPXiKjd16fRJ9O6TueLwrqO";

		//	string _accessTokenSecret = "qEAUzZnbvdtFJj51gAO0szMVlzCeCHenPBLEp3RRsj3zC";
		//	var _accessToken = "1228562882-DaM75urty2GqQmLZ0T2nBqJQ5CL7iZcxVPHszi0";

		//	// In v1.1, all API calls require authentication
		//	var service = new TwitterService(_consumerKey, _consumerSecret);
		//	service.AuthenticateWith(_accessToken, _accessTokenSecret);

		//	var tweets = service.ListTweetsOnHomeTimeline(new ListTweetsOnHomeTimelineOptions());
		//	foreach (var tweet in tweets)
		//	{
		//		Console.WriteLine("{0} says '{1}'", tweet.User.ScreenName, tweet.Text);
		//	}
		//}


		[Fact]
		public async void TestTheThing3()
		{
			// oauth application keys
			var oauth_consumer_key = "i4mKurz5tQfjEoiKyVsXVQrCx";
			string oauth_consumer_secret = "prADL3Do7ZBckqJ7oaKylNhTkHXIPXiKjd16fRJ9O6TueLwrqO";

			string oauth_token_secret = "qEAUzZnbvdtFJj51gAO0szMVlzCeCHenPBLEp3RRsj3zC";
			var oauth_token = "1228562882-DaM75urty2GqQmLZ0T2nBqJQ5CL7iZcxVPHszi0";

			// oauth implementation details
			var oauth_version = "1.0";
			var oauth_signature_method = "HMAC-SHA1";

			// unique request details
			var oauth_nonce = Convert.ToBase64String(
				new ASCIIEncoding().GetBytes(DateTime.Now.Ticks.ToString()));
			var timeSpan = DateTime.UtcNow
				- new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
			var oauth_timestamp = Convert.ToInt64(timeSpan.TotalSeconds).ToString();

			// message api details
			var status = "Updating status via REST API if this works";
			var resource_url = "http://api.twitter.com/1.1/statuses/update";

			// create oauth signature
			var baseFormat = "oauth_consumer_key={0}&oauth_nonce={1}&oauth_signature_method={2}" +
							"&oauth_timestamp={3}&oauth_token={4}&oauth_version={5}&status={6}";

			var baseString = string.Format(baseFormat,
										oauth_consumer_key,
										oauth_nonce,
										oauth_signature_method,
										oauth_timestamp,
										oauth_token,
										oauth_version,
										Uri.EscapeDataString(status)
										);

			baseString = string.Concat("POST&", Uri.EscapeDataString(resource_url), "&", Uri.EscapeDataString(baseString));

			var compositeKey = string.Concat(Uri.EscapeDataString(oauth_consumer_secret),
									"&", Uri.EscapeDataString(oauth_token_secret));

			string oauth_signature;
			using (HMACSHA1 hasher = new HMACSHA1(ASCIIEncoding.ASCII.GetBytes(compositeKey)))
			{
				oauth_signature = Convert.ToBase64String(
					hasher.ComputeHash(ASCIIEncoding.ASCII.GetBytes(baseString)));
			}

			// create the request header
			var headerFormat = "OAuth oauth_nonce=\"{0}\", oauth_signature_method=\"{1}\", " +
							   "oauth_timestamp=\"{2}\", oauth_consumer_key=\"{3}\", " +
							   "oauth_token=\"{4}\", oauth_signature=\"{5}\", " +
							   "oauth_version=\"{6}\"";

			var authHeader = string.Format(headerFormat,
									Uri.EscapeDataString(oauth_nonce),
									Uri.EscapeDataString(oauth_signature_method),
									Uri.EscapeDataString(oauth_timestamp),
									Uri.EscapeDataString(oauth_consumer_key),
									Uri.EscapeDataString(oauth_token),
									Uri.EscapeDataString(oauth_signature),
									Uri.EscapeDataString(oauth_version)
							);


			// make the request
			var postBody = "status=" + Uri.EscapeDataString(status);

			ServicePointManager.Expect100Continue = false;

			HttpWebRequest request = (HttpWebRequest)WebRequest.Create(resource_url);
			request.Headers.Add("Authorization", authHeader);
			request.Method = "POST";
			request.ContentType = "application/x-www-form-urlencoded";
			using (Stream stream = request.GetRequestStream())
			{
				byte[] content = ASCIIEncoding.ASCII.GetBytes(postBody);
				stream.Write(content, 0, content.Length);
			}
			WebResponse response = request.GetResponse();
		}

		[Fact]
		public async void TestTheThing2()
		{
			var oauth_consumer_key = "i4mKurz5tQfjEoiKyVsXVQrCx";
			string oauth_consumer_secret = "prADL3Do7ZBckqJ7oaKylNhTkHXIPXiKjd16fRJ9O6TueLwrqO";

			string oauth_token_secret = "qEAUzZnbvdtFJj51gAO0szMVlzCeCHenPBLEp3RRsj3zC";
			var oauth_token = "1228562882-DaM75urty2GqQmLZ0T2nBqJQ5CL7iZcxVPHszi0";

			var oauth_version = "1.0";
			var oauth_signature_method = "HMAC-SHA1";

			var resource_url = "https://api.twitter.com/1.1/statuses/update.json";
			var status = "Updating status via REST API if this works";

			var oauth_nonce = Convert.ToBase64String(
				new ASCIIEncoding().GetBytes(DateTime.Now.Ticks.ToString()));
			var timeSpan = DateTime.UtcNow
				- new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
			var oauth_timestamp = Convert.ToInt64(timeSpan.TotalSeconds).ToString();
			
			var postParams = new ParamsBuilder()
				.AddParam("oauth_consumer_key", oauth_consumer_key)
				.AddParam("oauth_nonce", oauth_nonce)
				.AddParam("oauth_signature_method", oauth_signature_method)
				.AddParam("oauth_timestamp", oauth_timestamp)				
				.AddParam("oauth_token", oauth_token)
				.AddParam("oauth_version", oauth_version)

				.AddParam("oauth_status", status)
				
				.BuildQuery(false);

			postParams = string.Concat("POST&", Uri.EscapeDataString(resource_url), "&", postParams);
			//Uri.EscapeDataString(
			

			var compositeKey = string.Concat(Uri.EscapeDataString(oauth_consumer_secret), "&", Uri.EscapeDataString(oauth_token_secret));

			string oauth_signature;
			using (HMACSHA1 hasher = new HMACSHA1(Encoding.ASCII.GetBytes(compositeKey)))
			{
				var authorBytes = Encoding.ASCII.GetBytes(postParams);
				oauth_signature = Convert.ToBase64String(hasher.ComputeHash(authorBytes));
			}


			var authParams = new ParamsBuilder()
				.AddParam("oauth_nonce", oauth_nonce)
				.AddParam("oauth_signature_method", oauth_signature_method)
				.AddParam("oauth_timestamp", oauth_timestamp)
				.AddParam("oauth_consumer_key", oauth_consumer_key)
				.AddParam("oauth_token", oauth_token)
				.AddParam("oauth_signature", oauth_signature)
				.AddParam("oauth_version", oauth_version);


			var authParamsStr = "OAuth " + authParams.BuildQuery(false, ",", "\"");

			ServicePointManager.Expect100Continue = false;

			var postBody = "status=" + Uri.EscapeDataString(status);

			HttpWebRequest request = (HttpWebRequest)WebRequest.Create(resource_url);
			request.Headers.Add("Authorization", authParamsStr);
			request.Method = "POST";
			request.ContentType = "application/x-www-form-urlencoded";

			using (Stream stream = request.GetRequestStream())
			{
				byte[] content = ASCIIEncoding.ASCII.GetBytes(postBody);
				stream.Write(content, 0, content.Length);
			}
			
			WebResponse response = request.GetResponse();
			var reader = new StreamReader(response.GetResponseStream());
			var objText = reader.ReadToEnd();

		}


		[Fact]
		public async void TestTheThing()
		{
			var oauth_consumer_key = "i4mKurz5tQfjEoiKyVsXVQrCx";
			string oauth_consumer_secret = "prADL3Do7ZBckqJ7oaKylNhTkHXIPXiKjd16fRJ9O6TueLwrqO";

			string oauth_token_secret = "qEAUzZnbvdtFJj51gAO0szMVlzCeCHenPBLEp3RRsj3zC";
			var oauth_token = "1228562882-DaM75urty2GqQmLZ0T2nBqJQ5CL7iZcxVPHszi0";

			var oauth_version = "1.0";
			var oauth_signature_method = "HMAC-SHA1";

			var oauth_nonce = Convert.ToBase64String(
				new ASCIIEncoding().GetBytes(DateTime.Now.Ticks.ToString()));
			var timeSpan = DateTime.UtcNow
				- new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
			var oauth_timestamp = Convert.ToInt64(timeSpan.TotalSeconds).ToString();

			
			

			var authorizationParams = new ParamsBuilder()				
				.AddParam("oauth_nonce", oauth_nonce)
				.AddParam("oauth_signature_method", oauth_signature_method)
				.AddParam("oauth_timestamp", oauth_timestamp)				
				.AddParam("oauth_consumer_key", oauth_consumer_key)
				.AddParam("oauth_token", oauth_token)				
				.AddParam("oauth_version", oauth_version);




			var authorizationQuery = authorizationParams.BuildQuery();


			var compositeKey = string.Concat(Uri.EscapeDataString(oauth_consumer_secret),"&", Uri.EscapeDataString(oauth_token_secret));

			string oauth_signature;
			using (HMACSHA1 hasher = new HMACSHA1(Encoding.ASCII.GetBytes(compositeKey)))
			{
				var authorBytes = Encoding.UTF8.GetBytes(authorizationQuery);
                oauth_signature = Convert.ToBase64String(hasher.ComputeHash(authorBytes));
			}

			authorizationParams
				.AddParam("oauth_signature", oauth_signature);

			//var authParamsStr = authorizationParams.BuildQuery(false, ",", "\"");

			var url = "https://api.twitter.com/oauth/request_token"; //?oauth_callback=" + (Uri.EscapeDataString("http://localhost:4441/adffffdasd"));

			var authHeader = "OAuth ";// + authParamsStr;

			HttpWebRequest request = (HttpWebRequest)WebRequest.Create(url);
			request.Headers.Add("Authorization", authHeader);
			request.Method = "POST";
			request.ContentType = "application/x-www-form-urlencoded";
			

			WebResponse response = request.GetResponse();
			var reader = new StreamReader(response.GetResponseStream());
			var objText = reader.ReadToEnd();
			
		}


		//public string GenerateSignature()
		//      {
		//IEnumerable<KeyValuePair<string, object>> nonSecretParameters; 


		//if (Multipart) 
		//{ 
		//	nonSecretParameters = (from p in this.Parameters 
		//							   where(!SecretParameters.Contains(p.Key) && p.Key.StartsWith("oauth_")) 
		//							   select p); 
		//} 
		//else 
		//{ 
		//	nonSecretParameters = (from p in this.Parameters
		//							   where (!SecretParameters.Contains(p.Key)) 
		//							   select p); 
		//} 


		//         Uri urlForSigning = this.RequestUri; 


		//         // Create the base string. This is the string that will be hashed for the signature. 
		//         string signatureBaseString = string.Format(
		//             CultureInfo.InvariantCulture,
		//             "{0}&{1}&{2}",
		//             this.Verb.ToString().ToUpper(CultureInfo.InvariantCulture),
		//             UrlEncode(NormalizeUrl(urlForSigning)),
		//             UrlEncode(nonSecretParameters)); 


		// Create our hash key (you might say this is a password) 
		//string key = string.Format(
		//	CultureInfo.InvariantCulture,
		//	"{0}&{1}",
		//	UrlEncode(this.Tokens.ConsumerSecret),
		//	UrlEncode(this.Tokens.AccessTokenSecret));




		//// Generate the hash 
		//HMACSHA1 hmacsha1 = new HMACSHA1(Encoding.UTF8.GetBytes(key)); 
		//         byte[] signatureBytes = hmacsha1.ComputeHash(Encoding.UTF8.GetBytes(signatureBaseString)); 
		//         return Convert.ToBase64String(signatureBytes); 
		//} 



		//void getTwitterData(string URL, string query, string page, string per_page)
		//{
		//	//UserAccount sua = (UserAccount)Session["SessionUser"];
		//	// oauth application keys
		//	var oauth_token = sua.TWToken; //"insert here...";
		//	var oauth_token_secret = sua.TWSecret; //"insert here...";

		//	var oauth_consumer_secret = "prADL3Do7ZBckqJ7oaKylNhTkHXIPXiKjd16fRJ9O6TueLwrqO";

		//	// oauth implementation details
		//	var oauth_version = "1.0";
		//	var oauth_signature_method = "HMAC-SHA1";

		//	// unique request details
		//	var oauth_nonce = Convert.ToBase64String(
		//		new ASCIIEncoding().GetBytes(DateTime.Now.Ticks.ToString()));
		//	var timeSpan = DateTime.UtcNow
		//		- new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc);
		//	var oauth_timestamp = Convert.ToInt64(timeSpan.TotalSeconds).ToString();

		//	// create oauth signature
		//	var baseFormat = "oauth_consumer_key={0}&oauth_nonce={1}&oauth_signature_method={2}" +
		//					"&oauth_timestamp={3}&oauth_token={4}&oauth_version={5}&q={6}&page={7}&per_page={8}";

		//	var baseString = string.Format(baseFormat,
		//								oauth_consumer_key,
		//								oauth_nonce,
		//								oauth_signature_method,
		//								oauth_timestamp,
		//								oauth_token,
		//								oauth_version,
		//								Uri.EscapeDataString(query),
		//								Uri.EscapeDataString(page),
		//								Uri.EscapeDataString(per_page)
		//								);

		//	baseString = string.Concat("GET&", Uri.EscapeDataString(URL), "&", Uri.EscapeDataString(baseString));

		//	var compositeKey = string.Concat(Uri.EscapeDataString(oauth_consumer_secret),
		//							"&", Uri.EscapeDataString(oauth_token_secret));

		//	string oauth_signature;
		//	using (HMACSHA1 hasher = new HMACSHA1(ASCIIEncoding.ASCII.GetBytes(compositeKey)))
		//	{
		//		oauth_signature = Convert.ToBase64String(
		//			hasher.ComputeHash(ASCIIEncoding.ASCII.GetBytes(baseString)));
		//	}









		//	// create the request header
		//	var headerFormat = "OAuth oauth_nonce=\"{0}\", oauth_signature_method=\"{1}\", " +
		//					   "oauth_timestamp=\"{2}\", oauth_consumer_key=\"{3}\", " +
		//					   "oauth_token=\"{4}\", oauth_signature=\"{5}\", " +
		//					   "oauth_version=\"{6}\"";

		//	var authHeader = string.Format(headerFormat,
		//							Uri.EscapeDataString(oauth_nonce),
		//							Uri.EscapeDataString(oauth_signature_method),
		//							Uri.EscapeDataString(oauth_timestamp),
		//							Uri.EscapeDataString(oauth_consumer_key),
		//							Uri.EscapeDataString(oauth_token),
		//							Uri.EscapeDataString(oauth_signature),
		//							Uri.EscapeDataString(oauth_version)
		//					);


		//	myDiv.InnerHtml = baseString + "<br/><br/><br/>" + authHeader;
		//	//return;
		//	ServicePointManager.Expect100Continue = false;

		//	// make the request
		//URL = URL + "?q=" + Uri.EscapeDataString(query) + "&page=" + Uri.EscapeDataString(page) + "&per_page=" + Uri.EscapeDataString(per_page);//

		//	HttpWebRequest request = (HttpWebRequest)WebRequest.Create(URL);
		//	request.Headers.Add("Authorization", authHeader);
		//	request.Method = "GET";
		//	request.ContentType = "application/x-www-form-urlencoded";

		//	WebResponse response = request.GetResponse();
		//	var reader = new StreamReader(response.GetResponseStream());
		//	var objText = reader.ReadToEnd();
		//	myDiv.InnerHtml = objText;
		//}


	}

	

	



}
