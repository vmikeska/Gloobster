using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gloobster.DomainModels
{
    public class RegenerateImgDO
    {
        public string UserId { get; set; }
        public int Left { get; set; }
        public int Top { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }

    public class ImageCrop
    {
        public void RegenerateThumbnails()
        {
            
        }


    }
}
