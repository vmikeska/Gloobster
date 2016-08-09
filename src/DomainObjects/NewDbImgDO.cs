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

    public class UpdateDbImgCutDO
    {
        public string CutId { get; set; }
        public string PhotoId { get; set; }        
        public string Data { get; set; }
        public string CutName { get; set; }
    }
}