using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
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

        private ImageCodecInfo GetEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
            return codecs.FirstOrDefault(codec => codec.FormatID == format.Guid);
        }

	    private Rectangle CalculateBestImgCut(int width, int height)
	    {
            if (height > width)
	        {
	            int length = width;

	            int top = (height - length)/2;

	            var rect = new Rectangle(0, top, length, length);
	            return rect;
	        }

            if (width > height)
            {
                int length = height;

                int left = (width - length) / 2;

                var rect = new Rectangle(left, 0, length, length);
                return rect;
            }

            //height == width
            var r = new Rectangle(0, 0, width, height);
            return r;
        }

        private Bitmap GetBitmapPart(Bitmap inputBmp, Rectangle rect)
        {
            Bitmap bmp = new Bitmap(rect.Width, rect.Height);
            Graphics g = Graphics.FromImage(bmp);

            // Draw the specified section of the source bitmap to the new one
            g.DrawImage(inputBmp, 0, 0, rect, GraphicsUnit.Pixel);

            // Clean up
            g.Dispose();

            return bmp;
        }

        private Stream ConvertImgToJpg(Bitmap inputBmp, long quality)
	    {
            MemoryStream memoryStream = new MemoryStream();
            
            using (var bmp1 = new Bitmap(inputBmp))
            {
                var jgpEncoder = GetEncoder(ImageFormat.Jpeg);
                var myEncoder = Encoder.Quality;
                using (var myEncoderParameters = new EncoderParameters(1))
                {
                    using (var myEncoderParameter = new EncoderParameter(myEncoder, quality))
                    {
                        myEncoderParameters.Param[0] = myEncoderParameter;
                        bmp1.Save(memoryStream, jgpEncoder, myEncoderParameters);
                    }
                }
            }

            memoryStream.Position = 0;
            return memoryStream;
	    }

        public Bitmap ResizeImage(Bitmap src, int width, int height)
        {
            Bitmap b = new Bitmap(width, height);
            using (Graphics g = Graphics.FromImage(b))
            {
                g.DrawImage(src, 0, 0, width, height);
            }

            return b;
        }

	    private void CreateThumbnail(Bitmap source, int dimension, string fileName)
	    {
            var newBmp = ResizeImage(source, dimension, dimension);
            var newJpgStream = ConvertImgToJpg(newBmp, 90);
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
			    var rect = CalculateBestImgCut(origBmp.Width, origBmp.Height);
			    var cutBmp = GetBitmapPart(origBmp, rect);
			    var jpgStream = ConvertImgToJpg(cutBmp, 90);

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