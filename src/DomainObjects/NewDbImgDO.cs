namespace Gloobster.DomainObjects
{
    public class NewDbImgDO
    {
        public int GID { get; set; }
        public string Data { get; set; }
        public string Desc { get; set; }
        public bool IsFree { get; set; }
        public int Origin { get; set; }
    }

    public class ImgDbPhotoDelDO
    {
        public string CityId { get; set; }
        public string ImgId { get; set; }
    }

    public class CutDO
    {        
        public string Id { get; set; }
        public string Name { get; set; }
        public string ShortName { get; set; }
        public int Width { get; set; }
        public int Height { get; set; }
    }

    public class DefaultDO
    {
        public string CityId { get; set; }
        public string PhotoId { get; set; }
        public string CutId { get; set; }
    }

    public class UpdateDbImgCutDO
    {
        public string CutId { get; set; }
        public string PhotoId { get; set; }        
        public string Data { get; set; }
        public string CutName { get; set; }
    }
}