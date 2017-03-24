using System;
using System.Net;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine8;
using Gloobster.Entities;
using MongoDB.Bson;
using Newtonsoft.Json;
using Serilog;

namespace Gloobster.DomainModels.SearchEngine8.Executing
{
    public class Calls: ICalls
    {
        public ILogger Log { get; set; }
        public IDbOperations DB { get; set; }
        
        public T CallServer<T>(string query)
        {
            try
            {
                var setting = new JsonSerializerSettings
                {
                    Error = (sender, args) =>
                    {
                        LogException("Error when parsing");
                    },
                    NullValueHandling = NullValueHandling.Ignore
                };

                using (var client = new WebClient())
                {
                    var requestStr = client.DownloadString(query);
                    var request = JsonConvert.DeserializeObject<T>(requestStr, setting);
                    return request;
                }
            }
            catch (Exception exc)
            {
                LogException(exc.Message);
                return default(T);
            }
        }

        private void LogException(string message)
        {
            if (Log != null)
            {
                Log.Error("CallerServerException: " + message);
            }

            if (DB != null)
            {
                var entity = new SkyPickerErrorLog
                {
                    Date = DateTime.Now,
                    id = ObjectId.GenerateNewId(),
                    Text = message
                };
                DB.SaveAsync(entity);
            }

            
        }

    }
}