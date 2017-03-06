using System;
using System.Collections.Generic;
using System.IO;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine8;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using System.Linq;
using System.Net;
using System.Text;
using Gloobster.Common;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.ImageDB;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.Entities;
using Gloobster.Enums.SearchEngine;
using Gloobster.Mappers.SearchEngine8;
using Gloobster.ReqRes.SearchEngine8;
using Microsoft.Extensions.PlatformAbstractions;

namespace Gloobster.Portal.Controllers.Api.Deals
{
    [Route("api/[controller]")]
    public class PlaceImageController : BaseApiController
    {
        public IFilesDomain FileDomain;
        public IApplicationEnvironment AppEnvironment;

        public PlaceImageController(IApplicationEnvironment appEnvironment, IFilesDomain fileDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            FileDomain = fileDomain;
            AppEnvironment = appEnvironment;
        }
        
        [HttpGet]
        [AuthorizeApi]
        public IActionResult Get(List<string> items)
        {
            var responses = new List<ImgResponse>();
            
            var itms = items.Select(i => new PlaceImg(i)).ToList();
            
            foreach (var item in itms)
            {
                var resp = new ImgResponse
                {
                    id = item.Id,
                    size = item.Size,
                    type = item.Type,
                    data = null
                };
                responses.Add(resp);

                if (item.Type == PlaceType.City)
                {
                    var basePath = FileDomain.Storage.Combine(ImgDbDomain.PhotosDir, ImgDbDomain.DefPhotosDir);
                    var fileName = "f.jpg";

                    var basePath2 = FileDomain.Storage.Combine(basePath, item.Id);
                    var fullPath = FileDomain.Storage.Combine(basePath2, fileName);
                    
                    bool exists = FileDomain.Storage.FileExists(fullPath);
                    if (exists)
                    {
                        var stream = FileDomain.GetFile(fullPath);
                        var base64 = BitmapUtils.ConvertToBase64(stream);

                        resp.data = base64;
                    }
                }

                if (item.Type == PlaceType.Country)
                {
                    using (var client = new WebClient())
                    {
                        var url = $"{GloobsterConfig.Protocol}://{GloobsterConfig.Domain}/images/n/flags-square/{item.Id}.svg";
                        string data = client.DownloadString(url);
                        resp.data = data;
                    }
                }
            }
            
            return new ObjectResult(responses);
        }
        
    }

    public class ImgResponse
    {        
        public string id { get; set; }
        public PlaceType type { get; set; }
        public int size { get; set; }
        public string data { get; set; }
    }


    public class PlaceImg
    {
        public PlaceImg(string str)
        {
            var prms = str.Split('-');
            Id = prms[0];
            Type = (PlaceType)int.Parse(prms[1]);
            Size = int.Parse(prms[2]);
        }

        public string Id { get; set; }
        public PlaceType Type { get; set; }
        public int Size { get; set; }
    }
}