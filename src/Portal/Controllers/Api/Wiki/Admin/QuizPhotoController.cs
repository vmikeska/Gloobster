using System;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog; 

namespace Gloobster.Portal.Controllers.Api.Wiki.Admin
{

    public class QuizPhotoConsts
    {
        public const string PicsDir = "qip";

        public static string GetFilePath(IFilesDomain filesDomain, int quizNo, int itemNo)
        {
            var fileName = $"{itemNo}.jpg";
            var dir = filesDomain.Storage.Combine(QuizPhotoConsts.PicsDir, quizNo.ToString());
            var filePath = filesDomain.Storage.Combine(dir, fileName);
            return filePath;
        }
    }

    public class QuizPhotoController : BaseApiController
    {
        public IWikiPermissions WikiPerms { get; set; }
        public IFilesDomain FilesDomain { get; set; }

        public QuizPhotoController(IFilesDomain filesDomain, IWikiPermissions wikiPerms, ILogger log, IDbOperations db) : base(log, db)
        {
            FilesDomain = filesDomain;
            WikiPerms = wikiPerms;
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] QuizFileRequest req)
        {
            if (!WikiPerms.IsSuperOrMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            var filePath = QuizPhotoConsts.GetFilePath(FilesDomain, req.quizNo, req.itemNo);
            
            if (FilesDomain.Storage.FileExists(filePath))
            {
                FilesDomain.DeleteFile(filePath);
            }
            
            var dataPrms = req.data.Split(',');
            var meta = dataPrms[0];
            var payload = dataPrms[1];

            var bytes = Convert.FromBase64String(payload);
            var origStream = new MemoryStream(bytes);

            var cutStream = GeneratePic(origStream, 900, 500);

            FilesDomain.Storage.SaveStream(filePath, cutStream);
            
            return new ObjectResult(true);
        }

        private Stream GeneratePic(Stream origFileStream, int newWidth, int newHeight)
        {
            Bitmap origBitmap = new Bitmap(origFileStream);

            float rateWidth = 1.0f;
            float rateHeight = ((float)newHeight) / ((float)newWidth);


            var rect = BitmapUtils.CalculateBestImgCut(origBitmap.Width, origBitmap.Height, rateWidth, rateHeight);
            var cutBmp = BitmapUtils.ExportPartOfBitmap(origBitmap, rect);
            var newBmp = BitmapUtils.ResizeImage(cutBmp, newWidth, newHeight);
            var jpgStream = BitmapUtils.ConvertBitmapToJpg(newBmp, 90);

            jpgStream.Position = 0;

            cutBmp.Dispose();
            newBmp.Dispose();

            return jpgStream;
        }

    }

    public class QuizFileRequest
    {
        public int quizNo { get; set; }
        public int itemNo { get; set; }
        public string data { get; set; }
    }
    

}