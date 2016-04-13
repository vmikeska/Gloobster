using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainModels.Langs;
using Gloobster.Entities;
using Gloobster.Enums;

namespace Gloobster.Portal.ViewModels
{
	public class ViewModelBase
	{
        public Languages Langs { get; set; }
        public string Lang { get; set; }
        public string DefaultLangModuleName { get; set; }

        public string UserId { get; set; }
        public bool IsUserLogged => User != null;
		public UserEntity User { get; set; }
		public IDbOperations DB { get; set; }
		public List<SocialNetworkType> SocialNetworks { get; set; }        
        public int NotificationCount { get; set; }

        public string FbToken { get; set; }

        public bool HasSocNet(SocialNetworkType net)
	    {
	        return SocialNetworks.Contains(net);
	    }

        public string W(string key)
	    {	        
	        return W(key, DefaultLangModuleName);
	    }

        public string W(string key, string module)
        {
            string text = Langs.GetWord(module, key, Lang);
            return text;
        }

        public bool HasAnyWikiPermissions { get; set; }
        public bool CanManageArticleAdmins { get; set; }

        public string SocNetworkStr
        {
            get
            {
                var nets = new List<string>();

                foreach (var account in SocialNetworks)
                {
                    if (account == SocialNetworkType.Facebook)
                    {
                        nets.Add("F");
                    }

                    if (account == SocialNetworkType.Twitter)
                    {
                        nets.Add("T");
                    }

                    if (account == SocialNetworkType.Google)
                    {
                        nets.Add("G");
                    }

                    if (account == SocialNetworkType.Base)
                    {
                        nets.Add("B");
                    }
                }

                var netStr = string.Join(",", nets);
                return netStr;
            }
        }
    }
}