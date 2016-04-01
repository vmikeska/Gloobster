using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using MongoDB.Bson;

namespace Gloobster.DomainModels.Wiki
{
    public class AvatarFilesConsts
    {
        public const string Location = "avatars";
        public const string FileName = "profile.jpg";
        public const string FileName_s = "profile_s.jpg";
        public const string FileName_xs = "profile_xs.jpg";
    }

    public class AvatarPhoto : IAvatarPhoto
    {
        public IDbOperations DB { get; set; }
        public IFilesDomain FileDomain { get; set; }

        public void CreateThumbnails(string location, Stream originalFile)
        {            
            var origBmp = new Bitmap(originalFile);
            var rect = BitmapUtils.CalculateBestImgCutRectangleShape(origBmp.Width, origBmp.Height);
            var cutBmp = BitmapUtils.ExportPartOfBitmap(origBmp, rect);
            var jpgStream = BitmapUtils.ConvertBitmapToJpg(cutBmp, 95);

            //save base rect cut
            var profilePath = FileDomain.Storage.Combine(location, AvatarFilesConsts.FileName);
            FileDomain.Storage.SaveStream(profilePath, jpgStream);

            CreateThumbnail(cutBmp, 60, AvatarFilesConsts.FileName_s, location);
            CreateThumbnail(cutBmp, 26, AvatarFilesConsts.FileName_xs, location);

            originalFile.Dispose();
            origBmp.Dispose();
            cutBmp.Dispose();
            jpgStream.Dispose();
        }

        public void DeleteOld(string location)
        {
            var filesInFolder = FileDomain.Storage.ListFiles(location);

            foreach (var file in filesInFolder)
            {
                var path = file.GetPath();
                bool fileExists = FileDomain.Storage.FileExists(path);
                if (fileExists)
                {
                    FileDomain.Storage.DeleteFile(path);
                }
            }
        }

        public async Task UpdateFileSaved(string userId)
        {
            var userIdObj = new ObjectId(userId);

            var filter = DB.F<UserEntity>().Eq(p => p.User_id, userIdObj);
            var update = DB.U<UserEntity>().Set(p => p.HasProfileImage, true);
            await DB.UpdateAsync(filter, update);
        }

        private void CreateThumbnail(Bitmap source, int dimension, string fileName, string location)
        {
            var newBmp = BitmapUtils.ResizeImage(source, dimension, dimension);
            var newJpgStream = BitmapUtils.ConvertBitmapToJpg(newBmp, 90);
            var path = FileDomain.Storage.Combine(location, fileName);

            FileDomain.Storage.SaveStream(path, newJpgStream);

            newBmp.Dispose();
            newJpgStream.Dispose();
        }
    }
}