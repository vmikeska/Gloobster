using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities.ImageDB
{
    public class ImageCityEntity : EntityBase
    {
        public int GID { get; set; }
        public string CountryCode { get; set; }
        public string CityName { get; set; }

        public List<DefaultCutSE> DefaultCuts { get; set; }

        public List<ImageSE> Images { get; set; }
    }

    public class DefaultCutSE
    {
        public ObjectId Cut_id { get; set; }
        public ObjectId Img_id { get; set; }
    }


    public class ImageSE
    {
        public ObjectId id { get; set; }
        public bool IsFree { get; set; }
        public string Desc { get; set; }
        public int Origin { get; set; }
    }

    public class ImageCutEntity : EntityBase
    {
        public string Name { get; set; }
        public string ShortName { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }
}
