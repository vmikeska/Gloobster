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
        public IWikiPermissions Perms { get; set; }

        public ImgDbPhotoController(IWikiPermissions perms, IImgDbDomain imgDb, ILogger log, IDbOperations db) : base(log, db)
        {
            ImgDb = imgDb;
            Perms = perms;
        }

        [AuthorizeApi]
        [HttpDelete]
        public async Task<IActionResult> Delete(DelImgRequest req)
        {
            if (!Perms.IsSuperOrMasterAdmin(UserId))
            {
                throw new Exception("NoPermissions");
            }

            var del = new ImgDbPhotoDelDO
            {
                ImgId = req.imgId,
                CityId = req.cityId
            };

            await ImgDb.DeletePhoto(del);
            
            return new ObjectResult(null);
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] NewImgRequest req)
        {
            if (!Perms.IsSuperOrMasterAdmin(UserId))
            {
                throw new Exception("NoPermissions");
            }

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


    public class DelImgRequest
    {
        public string cityId { get; set; }
        public string imgId { get; set; }
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