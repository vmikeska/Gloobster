namespace Gloobster.DomainObjects
{
    public class FacebookCheckinDO
    {
        public string Place { get; set; }
        public string Message { get; set; }
        public string Link { get; set; }

        public FacebookPrivacyDO Privacy { get; set; }

        //still possible:
        //tags
        //object_attachment
    }
}