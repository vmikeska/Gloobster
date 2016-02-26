using System.Drawing;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.User
{
    public class UploadAvatarController: BaseApiController
	{		
		public FilesDomain FileDomain { get; set; }

	    private string FileLocation;

		public UploadAvatarController(IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
		{			
			FileDomain = (FilesDomain)filesDomain;
		}
        
	    private void CreateThumbnail(Bitmap source, int dimension, string fileName)
	    {
            var newBmp = BitmapUtils.ResizeImage(source, dimension, dimension);
            var newJpgStream = BitmapUtils.ConvertBitmapToJpg(newBmp, 90);
            var path = FileDomain.Storage.Combine(FileLocation, fileName);

            FileDomain.Storage.SaveStream(path, newJpgStream);

            newBmp.Dispose();
            newJpgStream.Dispose();
        }

        [HttpPost]
		[AuthorizeApi]
		public IActionResult Post([FromBody] FileRequest request)
		{
			FileLocation = FileDomain.Storage.Combine("avatars", UserId);
            
            var fileName = "profile.jpg";
            var fileName_s = "profile_s.jpg";
            var fileName_xs = "profile_xs.jpg";

            FileDomain.OnFileSaved += (sender, args) =>
			{
				var argsObj = (OnFileSavedArgs) args;

                //save orig picture name
                var filter = DB.F<PortalUserEntity>().Eq(p => p.id, UserIdObj);
                var update = DB.U<PortalUserEntity>().Set(p => p.ProfileImage, argsObj.FileName);
                DB.UpdateAsync(filter, update);
                
			    var originalFile = FileDomain.GetFile(FileLocation, argsObj.FileName);

			    //create base rectangle cut
			    var origBmp = new Bitmap(originalFile);
			    var rect = BitmapUtils.CalculateBestImgCutRectangleShape(origBmp.Width, origBmp.Height);
			    var cutBmp = BitmapUtils.ExportPartOfBitmap(origBmp, rect);
			    var jpgStream = BitmapUtils.ConvertBitmapToJpg(cutBmp, 90);

			    //save base rect cut
			    var profilePath = FileDomain.Storage.Combine(FileLocation, fileName);
			    FileDomain.Storage.SaveStream(profilePath, jpgStream);

			    CreateThumbnail(cutBmp, 60, fileName_s);
			    CreateThumbnail(cutBmp, 26, fileName_xs);
			    
                originalFile.Dispose();
                origBmp.Dispose();
                cutBmp.Dispose();
                jpgStream.Dispose();                
			};

			FileDomain.OnBeforeCreate += (sender, args) =>
			{
			    var filesInFolder = FileDomain.Storage.ListFiles(FileLocation);

			    foreach (var file in filesInFolder)
			    {
			        var path = file.GetPath();
                    bool fileExists = FileDomain.Storage.FileExists(path);
                    if (fileExists)
                    {
                        FileDomain.Storage.DeleteFile(path);
                    }                    
                }                
			};

			var filePartDo = new WriteFilePartDO
			{
				Data = request.data,
				UserId = UserId,
				FileName = request.fileName,
				FilePart = request.filePartType,
				CustomFileName = "original",
				FileLocation = FileLocation,
				FileType = request.type
			};

			FileDomain.WriteFilePart(filePartDo);
			
			return new ObjectResult(null);
		}

	}
}