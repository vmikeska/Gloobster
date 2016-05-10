using System.IO;
using System.Net;
using Newtonsoft.Json;

namespace SpPlacesConverter
{
    public class GeoNamesService
    {
        public static CitySearchResponse GetCity(string cityName, string countryCode)
        {
            var qb = new QueryBuilder();
            qb.BaseUrl("http://api.geonames.org/")
                .Endpoint("searchJSON")
                .Param("username", "gloobster")
                .Param("name", cityName)
                .Param("country", countryCode)
                .Param("maxRows", "1");

            var url = qb.Build();

            WebRequest request = WebRequest.Create(url);
            // If required by the server, set the credentials.
            request.Credentials = CredentialCache.DefaultCredentials;

            WebResponse response = request.GetResponse();

            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);

            Stream dataStream = response.GetResponseStream();

            StreamReader reader = new StreamReader(dataStream);

            string responseFromServer = reader.ReadToEnd();
            var objResponse = JsonConvert.DeserializeObject<CitySearchResponse>(responseFromServer);

            reader.Close();
            response.Close();

            return objResponse;
        }
    }
}