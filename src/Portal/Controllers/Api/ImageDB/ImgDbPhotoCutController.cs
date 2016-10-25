using System;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class ImgDbPhotoCutController : BaseApiController
    {
        public IFilesDomain FileDomain { get; set; }
        public IImgDbDomain ImgDb { get; set; }
        public IWikiPermissions Perms { get; set; }

        public ImgDbPhotoCutController(IFilesDomain filesDomain, IWikiPermissions perms, IImgDbDomain imgDb, 
            ILogger log, IDbOperations db) : base(log, db)
        {
            FileDomain = filesDomain;
            ImgDb = imgDb;
            Perms = perms;

            FileDomain.DoNotSave = true;
        }


        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] UpdateDbImgCutRequest req)
        {
            if (req.filePartType == FilePartType.First)
            {
                if (!Perms.IsSuperOrMasterAdmin(UserId))
                {
                    throw new Exception("NoPermissions");
                }
            }
            
            var filePartDo = new WriteFilePartDO
            {
                Data = req.data,
                UserId = UserId,
                FilePart = req.filePartType
            };

            FileDomain.WriteFilePart(filePartDo);

            if (req.filePartType == FilePartType.Last)
            {
                var bytesStream = new MemoryStream(FileDomain.AllBytes);

                var bmp = new Bitmap(bytesStream);

                var update = new UpdateDbImgCutDO
                {
                    CutId = req.cutId,
                    Bmp = bmp,
                    PhotoId = req.photoId,
                    CutName = req.cutName
                };

                await ImgDb.UpdateImageCut(update);

                return new ObjectResult(true);
            }

            return new ObjectResult(false);
        }
        
        public class UpdateDbImgCutRequest
        {
            public FilePartType filePartType { get; set; }
            public string cutId { get; set; }
            public string photoId { get; set; }
            public string data { get; set; }
            public string cutName { get; set; }
        }



    }

    
}