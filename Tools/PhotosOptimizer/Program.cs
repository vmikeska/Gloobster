using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;

namespace PhotosOptimizer
{
    public class Program
    {
        public static void Main(string[] args)
        {
            string[] dirs = Directory.GetDirectories(@"C:\Users\vmike_000\Downloads\CityPhotos\CC");
            string dest = @"C:\Users\vmike_000\Downloads\CityPhotos\Conv";
            foreach (var dir in dirs)
            {
                string lastDirName = new DirectoryInfo(dir).Name;
                string cc = lastDirName;

                var files = Directory.GetFiles(dir);

                foreach (var file in files)
                {
                    var fullFileName = Path.GetFileName(file);
                    var prms = fullFileName.Split('.');
                    var fileName = prms[0];
                    var ext = prms[1];

                    using (var fs = new FileStream(file, FileMode.Open, FileAccess.Read))
                    {
                        var origBmp = new Bitmap(fs);
                        
                        float wRate = 1.0f;
                        float hRate = 1.0f;

                        if (origBmp.Width > origBmp.Height)
                        {
                            hRate = (float)origBmp.Height / (float)origBmp.Width;
                        }
                        else
                        {
                            wRate = (float)origBmp.Width / (float)origBmp.Height;
                        }

                        int newWidth = 1280;

                        int newHeight = (int) ((float) newWidth*(float) hRate);
                        
                        using (var stream = GeneratePic(origBmp, wRate, hRate, newWidth, newHeight))
                        {
                            var newFileDir = Path.Combine(dest, cc);
                            if (!Directory.Exists(newFileDir))
                            {
                                Directory.CreateDirectory(newFileDir);
                            }

                            var fullNewFilePath = Path.Combine(newFileDir, fullFileName);

                            using (var fileStream = File.Create(fullNewFilePath))
                            {
                                stream.Seek(0, SeekOrigin.Begin);
                                stream.CopyTo(fileStream);
                            }

                        }

                    }
  
                }
                
            }
        }

        private static Stream GeneratePic(Bitmap origBitmap, float rateWidth, float rateHeight, int newWidth, int newHeight)
        {
            var rect = BitmapUtils.CalculateBestImgCut(origBitmap.Width, origBitmap.Height, rateWidth, rateHeight);
            var cutBmp = BitmapUtils.ExportPartOfBitmap(origBitmap, rect);
            var newBmp = BitmapUtils.ResizeImage(cutBmp, newWidth, newHeight);
            var jpgStream = BitmapUtils.ConvertBitmapToJpg(newBmp, 50);

            jpgStream.Position = 0;

            cutBmp.Dispose();
            newBmp.Dispose();
            origBitmap.Dispose();

            return jpgStream;
        }
    }
}
