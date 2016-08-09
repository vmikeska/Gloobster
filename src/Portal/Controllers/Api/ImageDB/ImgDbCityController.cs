using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using Gloobster.Entities.ImageDB;
using System.Linq;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class ImgDbCityController : BaseApiController
    {        
        public ImgDbCityController(ILogger log, IDbOperations db) : base(log, db)
        {
            
        }

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get(QueryRequest req)
        {
            var city = DB.FOD<ImageCityEntity>(e => e.GID == req.gid.Value);

            if (city == null)
            {
                return new ObjectResult(null);
            }

            var response = new QueryResponse
            {
                id = city.id.ToString(),
                name = city.CityName,
                gid = city.GID,
                images = city.Images.Select(i => new PhotoResponse
                {
                    id = i.id.ToString(),
                    isFree = i.IsFree,
                    desc = i.Desc,
                    origin = i.Origin                    
                }).ToList()
            };

            return new ObjectResult(response);
        }
        
    }

    public class QueryResponse
    {
        public string id { get; set; }
        public int gid { get; set; }
        public string name { get; set; }
        public List<PhotoResponse> images { get; set; }
    }

    public class PhotoResponse
    {
        public string id { get; set; }
        public bool isFree { get; set; }
        public string desc { get; set; }
        public int origin { get; set; }
    }

    public class QueryRequest
    {
        public string query { get; set; }
        public int? gid { get; set; }
    }
    
   
}