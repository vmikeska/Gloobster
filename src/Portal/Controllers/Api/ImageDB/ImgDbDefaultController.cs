using System;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using Gloobster.DomainObjects;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class ImgDbDefaultController : BaseApiController
    {
        public IImgDbDomain ImgDbDomain;
        public IWikiPermissions Perms { get; set; }

        public ImgDbDefaultController(IWikiPermissions perms, IImgDbDomain imgDbDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            ImgDbDomain = imgDbDomain;
            Perms = perms;
        }

        
        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody] DefaultRequest req)
        {
            if (!Perms.IsSuperOrMasterAdmin(UserId))
            {
                throw new Exception("NoPermissions");
            }

            var ddo = new DefaultDO
            {
                CityId = req.cityId,
                PhotoId = req.photoId,
                CutId = req.cutId
            };

            await ImgDbDomain.SetDefaultCityPhotoCut(ddo);
            
            return new ObjectResult(null);
        }
        
    }

    public class DefaultRequest
    {
        public string cityId { get; set; }
        public string photoId { get; set; }
        public string cutId { get; set; }
    }
  
}