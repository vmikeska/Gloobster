using System;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;
using Gloobster.Entities.ImageDB;
using System.Linq;
using Gloobster.DomainObjects;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class ImgDbCutController : BaseApiController
    {
        public IWikiPermissions Perms { get; set; }
        public IImgDbDomain ImgDb { get; set; }

        public ImgDbCutController(IWikiPermissions perms, IImgDbDomain imgDb, ILogger log, IDbOperations db) : base(log, db)
        {
            ImgDb = imgDb;
            Perms = perms;
        }

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            if (!Perms.IsSuperOrMasterAdmin(UserId))
            {
                throw new Exception("NoPermissions");
            }

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
            if (!Perms.IsSuperOrMasterAdmin(UserId))
            {
                throw new Exception("NoPermissions");
            }

            var cd = new CutDO
            {
                Name = req.name,
                ShortName = req.shortName,
                Width = req.width,
                Height = req.height
            };

            await ImgDb.AddNewCut(cd);
            
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