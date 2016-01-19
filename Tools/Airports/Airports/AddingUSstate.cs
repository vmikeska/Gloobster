using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace Airports
{

    public class GeoNamesCityNew
    {
        public int GID { get; set; }
        public string Name { get; set; }
        public string AsciiName { get; set; }
        public string AlternateNames { get; set; }
        public LatLng Coordinates { get; set; }
        public string CountryCode { get; set; }
        public string AlternateCountryCode { get; set; }
        public string Population { get; set; }
        public string Elevation { get; set; }
        public string TimeZone { get; set; }
        public string UsState { get; set; }
    }

    public class AddingUSstate
    {
        public static void Execute()
        {
            var path = @"C:\S\DBScripts\Cities1000.json";
            var file = new StreamReader(path);
            string line;
            int count = 0;
            string batchText;
            bool blocked = true;

            var batch = new StringBuilder();
            while ((line = file.ReadLine()) != null)
            {
                if (line == "[")
                {
                    continue;
                }

                var trimLine = line.Trim();

                if (string.IsNullOrEmpty(trimLine))
                {
                    continue;
                }

                var cleanLine = trimLine.Substring(0, trimLine.Length - 1);

                var city = JsonConvert.DeserializeObject<GeoNamesCityNew>(cleanLine);

                if (city.GID == 5687028)
                {
                    blocked = false;
                }

                if (blocked)
                {
                    continue;
                }

                if (city.CountryCode == "US")
                {
                    var serverCity = GetCityFromServerById(city.GID);
                    if (serverCity.adminCode1 == null)
                    {
                        batchText = batch.ToString();
                        AppendOutputText(batchText);
                        throw new Exception("NO admin code");
                    }

                    city.UsState = serverCity.adminCode1;
                }
                
                var cityStr = JsonConvert.SerializeObject(city);                
                batch.Append(cityStr);
                batch.Append(",");
                batch.Append(Environment.NewLine);
                count ++;

                if (count == 100)
                {
                    batchText = batch.ToString();
                    AppendOutputText(batchText);
                    batch = new StringBuilder();

                    count = 0;
                }

            }

            batchText = batch.ToString();
            AppendOutputText(batchText);

            file.Close();


            // Suspend the screen.
            Console.ReadLine();
        }
        

        public static void AppendOutputText(string line)
        {
            var outPath = @"C:\S\DBScripts\Cities1000us.json";

            using (var sw = File.AppendText(outPath))
            {
                sw.Write(line);
            }
            Console.WriteLine("Wrote 100");
        }

        public static dynamic GetCityFromServerById(int gid)
        {

            var qb = new QueryBuilder();
            qb.BaseUrl("http://api.geonames.org/")
                .Endpoint("getJSON")
                .Param("username", "gloobster")
                .Param("geonameId", gid.ToString());

            var url = qb.Build();

            WebRequest request = WebRequest.Create(url);
            // If required by the server, set the credentials.
            request.Credentials = CredentialCache.DefaultCredentials;

            WebResponse response = request.GetResponse();

            //Console.WriteLine(((HttpWebResponse)response).StatusDescription);

            Stream dataStream = response.GetResponseStream();

            StreamReader reader = new StreamReader(dataStream);

            string responseFromServer = reader.ReadToEnd();
            dynamic objResponse = JsonConvert.DeserializeObject(responseFromServer);

            reader.Close();
            response.Close();

            return objResponse;
        }
    }
}
