using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;
using Gloobster.Entities.ImageDB;
using System.Linq;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class ImgDbCutController : BaseApiController
    {
        public IFilesDomain FilesDomain;
        public IGeoNamesService GNS;

        public ImgDbCutController(IGeoNamesService gns, IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            FilesDomain = filesDomain;
            GNS = gns;
        }

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var cuts = DB.List<ImageCutEntity>();

            var res = cuts.Select(c => new NewCutReqRes
            {
                id = c.id.ToString(),
                name = c.Name,
                shortName = c.ShortName,
                height = c.Height,
                width = c.Width
            });

            return new ObjectResult(res);
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] NewCutReqRes req)
        {
            var cut = new ImageCutEntity
            {
                id = ObjectId.GenerateNewId(),
                Name = req.name,
                ShortName = req.shortName,
                Width = req.width,
                Height = req.height
            };

            await DB.SaveAsync(cut);

            return new ObjectResult(null);
        }


    }
    
    public class NewCutReqRes
    {
        public string id { get; set; }
        public string name { get; set; }
        public string shortName { get; set; }
        public int width { get; set; }
        public int height { get; set; }
    }
  
}