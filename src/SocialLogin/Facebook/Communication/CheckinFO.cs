namespace Gloobster.SocialLogin.Facebook.Communication
{
    public class CheckinFO
    {
        //The main body of the post, otherwise called the status message.Either link, place, or message must be supplied.
        public string message { get; set; }

        //The URL of a link to attach to the post. Either link, place, or message must be supplied.Additional fields associated with link are shown below.
        public string link { get; set; }
        
        //Page ID of a location associated with this post.Either link, place, or message must be supplied.
        public string place { get; set; }
        
        //Comma-separated list of user IDs of people tagged in this post.You cannot specify this field without also specifying a place.
        //possibly FacebookPrivacyDO
        public string tags { get; set; }
        
        //Determines the privacy settings of the post.If not supplied, this defaults to the privacy level granted to the app in the Login Dialog.This field cannot be used to set a more open privacy setting than the one granted.
        public object privacy { get; set; }
        
        //Facebook ID for an existing picture in the person's photo albums to use as the thumbnail image. They must be the owner of the photo, and the photo cannot be part of a message attachment.
        public string object_attachment { get; set; }        
    }
}
