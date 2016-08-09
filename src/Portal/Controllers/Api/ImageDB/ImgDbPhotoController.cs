using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;
using System.Drawing;
using System.IO;
using Gloobster.Common;
using Gloobster.Entities.ImageDB;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class ImgDbPhotoController : BaseApiController
    {
        public IImgDbDomain ImgDb { get; set; }

        public ImgDbPhotoController(IImgDbDomain imgDb, ILogger log, IDbOperations db) : base(log, db)
        {
            ImgDb = imgDb;
        }

        //[AuthorizeApi]
        //[HttpGet]
        //public async Task<IActionResult> Get(GetMsgsRequest req)
        //{
  
        //    return new ObjectResult(null);
        //}
        
        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] NewImgRequest req)
        {
            var np = new NewDbImgDO
            {
                GID = req.gid,
                Data = req.data,
                IsFree = req.isFree,
                Origin = req.origin,
                Desc = req.desc
            };

            string id = await ImgDb.AddNewPhoto(np);
            
            return new ObjectResult(id);
        }

        
        

    }


    
    
    public class NewImgRequest
    {
        public string data { get; set; }
        public int gid { get; set; }
        public bool isFree { get; set; }
        public string desc { get; set; }
        public string cityName { get; set; }
        public int origin { get; set; }
    }
}