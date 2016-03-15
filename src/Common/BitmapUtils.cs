using System.IO;
using System.Linq;
using System.Drawing;
using System.Drawing.Imaging;

namespace Gloobster.Common
{
    public class BitmapUtils
    {

        public static Bitmap ResizeImage(Bitmap src, int width, int height)
        {
            Bitmap b = new Bitmap(width, height);
            using (Graphics g = Graphics.FromImage(b))
            {
                g.DrawImage(src, 0, 0, width, height);
            }

            return b;
        }

        public static Bitmap ExportPartOfBitmap(Bitmap inputBmp, Rectangle rect)
        {
            Bitmap bmp = new Bitmap(rect.Width, rect.Height);
            Graphics g = Graphics.FromImage(bmp);

            // Draw the specified section of the source bitmap to the new one
            g.DrawImage(inputBmp, 0, 0, rect, GraphicsUnit.Pixel);

            // Clean up
            g.Dispose();

            return bmp;
        }

        public static Stream ConvertBitmapToJpg(Bitmap inputBmp, long quality)
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

        public static byte[] StreamToBytes(Stream stream)
        {
            using (MemoryStream ms = new MemoryStream())
            {
                stream.CopyTo(ms);
                var byts = ms.ToArray();
                return byts;
            }
        }

        public static Rectangle CalculateBestImgCut(int width, int height, float rateWidth, float rateHeight)
        {
            int lastWidth = 1;
            int lastHeight = 1;
            bool run = true;

            int index = 1;
            while (run)
            {
                index++;
                int currentWidth = (int)(index * rateWidth);
                int currentHeight = (int) (index * rateHeight);

                if ((currentWidth > width) || (currentHeight > height))
                {
                    run = false;
                }
                else
                {
                    lastWidth = currentWidth;
                    lastHeight = currentHeight;
                }
            }

            int outTop = (height - lastHeight) / 2;
            int outLeft = (width - lastWidth) / 2;

            var r = new Rectangle(outLeft, outTop, lastWidth, lastHeight);
            return r;
        }

        //public static Rectangle CalculateBestImgCut(int width, int height, float rateWidth, float rateHeight)
        //{
        //    int outWidth = 0;
        //    int outHeight = 0;
        //    int outTop;
        //    int outLeft;

        //    if (rateWidth == 1)
        //    {
        //        outWidth = width;
        //        outHeight = (int)(width * rateHeight);

        //        if (outHeight > height)
        //        {
        //            outHeight = height;

        //            float rate = (rateWidth / rateHeight);
        //            outWidth = (int)(outHeight * rate);
        //        }
        //    }



        //    if (rateHeight == 1)
        //    {
        //        outWidth = (int)(height * rateWidth);
        //        outHeight = height;
        //    }

        //    outTop = (height - outHeight)/2;
        //    outLeft = (width - outWidth) / 2;
            
        //    var r = new Rectangle(outLeft, outTop, outWidth, outHeight);
        //    return r;
        //}

        public static Rectangle CalculateBestImgCutRectangleShape(int width, int height)
        {
            if (height > width)
            {
                int length = width;

                int top = (height - length) / 2;

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

        private static ImageCodecInfo GetEncoder(ImageFormat format)
        {
            ImageCodecInfo[] codecs = ImageCodecInfo.GetImageDecoders();
            return codecs.FirstOrDefault(codec => codec.FormatID == format.Guid);
        }
    }
}