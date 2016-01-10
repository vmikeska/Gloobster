using System.Collections.Generic;

namespace Gloobster.SocialLogin.Facebook.Communication
{
    public class FacebookPermissionsFO
    {
        public List<FacebookPermissionFO> data { get; set; }
    }

    public class FacebookPermissionFO
    {
        public string permission { get; set; }
        public string status { get; set; }
    }
}