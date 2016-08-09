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
    public class ImgDbPhotoCutController : BaseApiController
    {
        public IImgDbDomain ImgDb { get; set; }

        public ImgDbPhotoCutController(IImgDbDomain imgDb, ILogger log, IDbOperations db) : base(log, db)
        {
            ImgDb = imgDb;
        }
        
        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody] UpdateDbImgCutRequest req)
        {        
            var update = new UpdateDbImgCutDO
            {
                CutId = req.cutId,
                Data = req.data,
                PhotoId = req.photoId,
                CutName = req.cutName
            };

            await ImgDb.UpdateImageCut(update);
            
            return new ObjectResult(null);
        }


        public class UpdateDbImgCutRequest
        {
            public string cutId { get; set; }
            public string photoId { get; set; }
            public string data { get; set; }
            public string cutName { get; set; }
        }



    }

    
}