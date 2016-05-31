using System;
using System.Net;
using Newtonsoft.Json;

namespace Gloobster.DomainModels.SearchEngine
{
    public class Calls
    {
        public T CallServer<T>(string query)
        {
            try
            {
                using (var client = new WebClient())
                {
                    var requestStr = client.DownloadString(query);
                    var request = JsonConvert.DeserializeObject<T>(requestStr);
                    return request;
                }
            }
            catch (Exception exc)
            {
                return default(T);
            }
        }

    }
}