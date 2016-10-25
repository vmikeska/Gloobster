using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Services.Trip;
using Gloobster.DomainModels.Wiki;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Trip;
using Gloobster.Enums;
using Gloobster.Mappers;
using Gloobster.Portal.Controllers.Api.Wiki;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Gloobster.ReqRes.Trip;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.ImageDB
{
	public class ImgDbPhotoController : BaseApiController
	{		
		public IFilesDomain FileDomain { get; set; }
        public IImgDbDomain ImgDb { get; set; }
        public IWikiPermissions Perms { get; set; }

        public ImgDbPhotoController(IWikiPermissions perms, IImgDbDomain imgDb, IFilesDomain filesDomain,
            ILogger log,  IDbOperations db) : base(log, db)
		{			
			FileDomain = filesDomain;
			Log = log;
            ImgDb = imgDb;
            Perms = perms;

            FileDomain.DoNotSave = true;
        }
		
		[HttpPost]
		[AuthorizeApi]
		public async Task<IActionResult> Post([FromBody] NewImgRequest req)
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

                var origBmp = new Bitmap(bytesStream);

                var np = new NewDbImgDO
                {
                    GID = req.gid,
                    Bmp = origBmp,
                    IsFree = req.isFree,
                    Origin = req.origin,
                    Desc = req.desc
                };

                if (origBmp.Width > 1920)
                {
                    double ratio = (double)origBmp.Height / (double)origBmp.Width;
                    int newWidth = 1920;
                    int newHeight = (int)(newWidth * ratio);

                    var resizedBmp = BitmapUtils.ResizeImage(origBmp, newWidth, newHeight);

                    np.Bmp = resizedBmp;
                }

                string id = await ImgDb.AddNewPhoto(np);

                return new ObjectResult(true);
            }

            return new ObjectResult(false);
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

    }

    public class NewImgRequest
    {
        public string data { get; set; }
        public FilePartType filePartType { get; set; }


        public int gid { get; set; }
        public bool isFree { get; set; }
        public string desc { get; set; }
        public string cityName { get; set; }
        public int origin { get; set; }
    }

    public class DelImgRequest
    {
        public string cityId { get; set; }
        public string imgId { get; set; }
    }
}