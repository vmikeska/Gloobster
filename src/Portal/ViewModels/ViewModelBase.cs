using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainModels.Langs;
using Gloobster.Entities;
using Gloobster.Enums;
using Microsoft.AspNet.Http;
using Microsoft.Net.Http.Server;
using System.Linq;

namespace Gloobster.Portal.ViewModels
{
    public class ModuleTexts
    {
        public string Name { get; set; }
        public List<WordPair> Texts;
    }

    public class EmptyViewModel : ViewModelBase
    {

    }

    public class AboutViewModel : ViewModelBase
    {

    }


    public class InfoBlocks
    {
        public List<InfoBlock> infos { get; set; }
    }

    public class InfoBlock
    {
        public string id { get; set; }
        public bool visible { get; set; }
    }

    public class ViewModelBase
    {
        public string Locale { get; set; }
        public Languages Langs { get; set; }
        public string Lang { get; set; }
        public string DefaultLangModuleName { get; set; }

        public string UserId { get; set; }
        public bool IsUserLogged => User != null;
        public UserEntity User { get; set; }
        public IDbOperations DB { get; set; }
        public List<SocialNetworkType> SocialNetworks { get; set; }
        public int NotificationCount { get; set; }
        public List<ModuleTexts> ClientModules { get; set; }
        public string FbToken { get; set; }
        public bool HasUserAgent { get; set; }
        public InfoBlocks InfoBlocks { get; set; }
        public bool CookiesConfirmed { get; set; }
        public int UnreadMessagesCount { get; set; }

        public FbShareConfig FbShareMeta { get; set; }

        public int AdminTasks { get; set; }
        public int WikiAdminTasks { get; set; }

        public bool HasSocNet(SocialNetworkType net)
        {
            return SocialNetworks.Contains(net);
        }

        public bool IsDemo { get; set; }

        public string W(string key)
        {
            return W(key, DefaultLangModuleName);
        }

        public string W(string key, string module)
        {
            string text = Langs.GetWord(module, key, Lang);
            return text;
        }

        public void LoadClientTexts(string[] modules = null)
        {
            if (!HasUserAgent)
            {
                return;
            }

            ClientModules = new List<ModuleTexts>();

            var allModules = new List<string> { "jsLayout" };
            if (modules != null)
            {
                allModules.AddRange(modules);
            }

            foreach (var module in allModules)
            {
                var moduleText = new ModuleTexts
                {
                    Texts = Langs.GetModuleTexts(module, Lang),
                    Name = module
                };
                ClientModules.Add(moduleText);
            }
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

        private bool InfoBlockVisible(string id)
        {
            var block = InfoBlocks.infos.FirstOrDefault(i => i.id == id);
            if (block == null)
            {
                return true;
            }

            if (block.visible)
            {
                return true;
            }

            return false;
        }

        public InfoBlockResult InfoBlock(string id)
        {
            bool visible = InfoBlockVisible(id);

            var res = new InfoBlockResult
            {
                BaseModel = this,

                IsVisible = visible,
                BtnTxt = visible ? W("HideTitleInfo", "layout") : W("ShowTitleInfo", "layout"),
                Class = visible ? string.Empty : "collapsed",
                Css = visible ? string.Empty : "display:none;",
                LinkSteps = new List<LinkStep>()
            };

            return res;
        }
    }

    public class FbShareConfig
    {
        public string fb_app_id { get; set; }
        public string og_url { get; set; }
        public string og_type { get; set; }
        public string og_title { get; set; }
        public string og_description { get; set; }
        public string og_image { get; set; }
        public string og_image_type { get; set; }
        public string og_image_width { get; set; }
        public string og_image_height { get; set; }
    }

    public class InfoBlockResult
    {
        public ViewModelBase BaseModel { get; set; }

        public bool IsVisible { get; set; }
        public string Css { get; set; }
        public string Class { get; set; }
        public string BtnTxt { get; set; }

        public List<LinkStep> LinkSteps { get; set; }
    }

    public class LinkStep
    {
        public string Link { get; set; }
        public string Txt { get; set; }
    }


}