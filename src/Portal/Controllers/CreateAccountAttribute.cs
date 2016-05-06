using System;
using System.Collections.Generic;
using System.Data;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Entities;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Filters;
using Newtonsoft.Json;
using System.Linq;
using System.Net;
using System.Text;
using System.Xml;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Http.Features;
using Microsoft.Extensions.Primitives;
using MongoDB.Bson;
using Newtonsoft.Json.Linq;
using UAParser;

namespace Gloobster.Portal.Controllers
{
    
    public class UserToken
    {
        public string UserId { get; set; }
        public string Secret { get; set; }
    }

    public class TokenConstants
    {
        public const string CookieKeyName = "token";
        public const string CallbackKeyName = "callback";
    }

    public class TokenUtils
    {
        public string IssueNewToken()
        {
            var token = new UserToken
            {
                Secret = Guid.NewGuid().ToString(),
                UserId = ObjectId.GenerateNewId().ToString()
            };

            string encodedToken = CreateTokenString(token);
            return encodedToken;
        }

        public string CreateTokenString(UserToken token)
        {
            var tokenStr = JsonConvert.SerializeObject(token);
            var tokenJson = JObject.Parse(tokenStr);

            string encodedToken = JsonWebToken.Encode(tokenJson, GloobsterConfig.AppSecret, JwtHashAlgorithm.RS256);
            return encodedToken;
        }

        public UserToken ReadToken(HttpContext context)
        {
            var tokenStr = context.Request.Cookies[TokenConstants.CookieKeyName].ToString();
            if (string.IsNullOrEmpty(tokenStr))
            {
                return null;
            }

            try
            {
                string decodedStr = JsonWebToken.Decode(tokenStr, GloobsterConfig.AppSecret, true);

                var tokenObj = JsonConvert.DeserializeObject<UserToken>(decodedStr);
                return tokenObj;
            }
            catch
            {
                return null;
            }
        }
    }

    public class CreateAccountAttribute : ActionFilterAttribute
    {
        private AccessLogEntity AccessLog;

        private void InitLog(string userAgent, string url, string ip)
        {
            AccessLog = new AccessLogEntity
            {
                Time = DateTime.UtcNow,
                UserAgent = userAgent,
                IsBot = false,
                Url = url,
                IP = ip,
                id = ObjectId.GenerateNewId()
            };
        }

        private void SaveLog()
        {
            var db = new DbOperations();
            db.SaveAsync(AccessLog);
        }

        private string GetIp(ActionExecutingContext context)
        {
            var ip = new StringBuilder();

            try
            {
                var cx = context.HttpContext;

                string ip1 = cx.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString();
                ip.Append($"ip1: {ip1}");
                
                string ip2 = cx.Request.Headers["REMOTE_ADDR"];
                ip.Append($"ip2: {ip2}");

                string ip3 = cx.Request.Headers["HTTP_X_FORWARDED_FOR"];
                ip.Append($"ip3: {ip3}");

                string ip4 = context.HttpContext.Connection.RemoteIpAddress.ToString();
                ip.Append($"ip4: {ip4}");

                return ip.ToString();
            }
            catch
            {
                return ip.ToString();
            }
        }



        public override async void OnActionExecuting(ActionExecutingContext context)
        {
            try
            {
                var cx = context.HttpContext;
                var userAgent = cx.Request.Headers["User-Agent"].ToString();

                string ip = GetIp(context);

                //bool isBot = IsBot(userAgent);
                var uaParser = Parser.GetDefault();
                ClientInfo client = uaParser.Parse(userAgent);
                
                InitLog(userAgent, cx.Request.Path, ip);

                bool isBot = string.IsNullOrEmpty(userAgent) || client.Device.IsSpider;
                if (isBot)
                {
                    base.OnActionExecuting(context);

                    AccessLog.IsBot = true;

                    return;
                }

                var token = ReadToken(context);
                bool hasToken = token != null;

                AccessLog.HasToken = hasToken;

                if (hasToken)
                {
                    var accountCreator = new AccountCreator();
                    var account = await accountCreator.CreateOrReturnAccount(token.Secret, token.UserId);

                    AccessLog.User_id = account.User_id;

                    var controller = (PortalBaseController) context.Controller;
                    controller.UserId = account.User_id.ToString();

                    base.OnActionExecuting(context);
                    return;
                }
                else
                {
                    var callback = cx.Request.Query[TokenConstants.CallbackKeyName];
                    bool hasCallback = !string.IsNullOrEmpty(callback);
                    AccessLog.HasCallback = hasCallback;
                    if (hasCallback)
                    {
                        //in this case the requestor is not able to keep session
                        base.OnActionExecuting(context);
                        return;
                    }
                }

                //user is not logged, let's generate the session                
                IssueNewToken(context);
                AccessLog.TokenIssued = true;

                //hasn't session cookie
                AddCallbackQueryStringParam(context);
            }
            finally
            {
                SaveLog();
            }
        }

        //private bool IsBot(string userAgent)
        //{
        //    var userAgentLow = userAgent.ToLower();
        //    if (string.IsNullOrEmpty(userAgentLow))
        //    {
        //        return true;
        //    }

        //    return false;
        //}
        
        private UserToken ReadToken(ActionExecutingContext context)
        {
            var utils = new TokenUtils();
            return utils.ReadToken(context.HttpContext);
        }
        
        private void IssueNewToken(ActionExecutingContext context)
        {
            var utils = new TokenUtils();
            var token = utils.IssueNewToken();
            
            context.HttpContext.Response.Cookies.Append(TokenConstants.CookieKeyName, token);
        }

        private void AddCallbackQueryStringParam(ActionExecutingContext context)
        {
            var path = context.HttpContext.Request.Path;
            var pathToRedirect = $"{path}?{TokenConstants.CallbackKeyName}=true";

            context.Result = new RedirectResult(pathToRedirect);
        }

        //public bool IsCrawlerByUserAgent(string userAgent)
        //{
        //    if (userAgent.Contains("bot"))
        //    {
        //        return true;
        //    }


        //    // crawlers that have 'bot' in their useragent
        //    //var Crawlers1 = new List<string>
        //    //{
        //    //    "googlebot","bingbot","yandexbot","ahrefsbot","msnbot","linkedinbot","exabot","compspybot",
        //    //    "yesupbot","paperlibot","tweetmemebot","semrushbot","gigabot","voilabot","adsbot-google",
        //    //    "botlink","alkalinebot","araybot","undrip bot","borg-bot","boxseabot","yodaobot","admedia bot",
        //    //    "ezooms.bot","confuzzledbot","coolbot","internet cruiser robot","yolinkbot","diibot","musobot",
        //    //    "dragonbot","elfinbot","wikiobot","twitterbot","contextad bot","hambot","iajabot","news bot",
        //    //    "irobot","socialradarbot","ko_yappo_robot","skimbot","psbot","rixbot","seznambot","careerbot",
        //    //    "simbot","solbot","mail.ru_bot","spiderbot","blekkobot","bitlybot","techbot","void-bot",
        //    //    "vwbot_k","diffbot","friendfeedbot","archive.org_bot","woriobot","crystalsemanticsbot","wepbot",
        //    //    "spbot","tweetedtimes bot","mj12bot","who.is bot","psbot","robot","jbot","bbot","bot"
        //    //};

        //    // crawlers that don't have 'bot' in their useragent
        //    var crawlers2 = new List<string>
        //    {
        //        "baiduspider","80legs","baidu","yahoo! slurp","ia_archiver","mediapartners-google","lwp-trivial",
        //        "nederland.zoek","ahoy","anthill","appie","arale","araneo","ariadne","atn_worldwide","atomz",
        //        "bjaaland","ukonline","bspider","calif","christcrawler","combine","cosmos","cusco","cyberspyder",
        //        "cydralspider","digger","grabber","downloadexpress","ecollector","ebiness","esculapio","esther",
        //        "fastcrawler","felix ide","hamahakki","kit-fireball","fouineur","freecrawl","desertrealm",
        //        "gammaspider","gcreep","golem","griffon","gromit","gulliver","gulper","whowhere","portalbspider",
        //        "havindex","hotwired","htdig","ingrid","informant","infospiders","inspectorwww","iron33",
        //        "jcrawler","teoma","ask jeeves","jeeves","image.kapsi.net","kdd-explorer","label-grabber",
        //        "larbin","linkidator","linkwalker","lockon","logo_gif_crawler","marvin","mattie","mediafox",
        //        "merzscope","nec-meshexplorer","mindcrawler","udmsearch","moget","motor","muncher","muninn",
        //        "muscatferret","mwdsearch","sharp-info-agent","webmechanic","netscoop","newscan-online",
        //        "objectssearch","orbsearch","packrat","pageboy","parasite","patric","pegasus","perlcrawler",
        //        "phpdig","piltdownman","pimptrain","pjspider","plumtreewebaccessor","getterrobo-plus","raven",
        //        "roadrunner","robbie","robocrawl","robofox","webbandit","scooter","search-au","searchprocess",
        //        "senrigan","shagseeker","site valet","skymob","slcrawler","slurp","snooper","speedy",
        //        "spider_monkey","spiderline","curl_image_client","suke","www.sygol.com","tach_bw","templeton",
        //        "titin","topiclink","udmsearch","urlck","valkyrie libwww-perl","verticrawl","victoria",
        //        "webscout","voyager","crawlpaper","wapspider","webcatcher","t-h-u-n-d-e-r-s-t-o-n-e",
        //        "webmoose","pagesinventory","webquest","webreaper","webspider","webwalker","winona","occam",
        //        "robi","fdse","jobo","rhcs","gazz","dwcp","yeti","crawler","fido","wlm","wolp","wwwc","xget",
        //        "legs","curl","webs","wget","sift","cmc"
        //    };

        //    var isCrawler = crawlers2.Any(crawler => userAgent.Contains(crawler));
        //    return isCrawler;
        //}
    }    
}