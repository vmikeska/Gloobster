using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Gloobster.ReqRes.Facebook;
using Gloobster.SocialLogin.Facebook.Communication;
using Microsoft.AspNet.Mvc;
using Newtonsoft.Json;
using Serilog;
using Microsoft.AspNet.Http;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.Registration
{
    //public class FacebookLogin
    //{
    //    public ILogger Log { get; set; }
    //    public IFacebookService FBService { get; set; }        
    //}
    
    [Route("api/[controller]")]
	public class FacebookUserController : BaseApiController
	{
		public ISocNetworkService SocNetService { get; set; }
        public IComponentContext ComponentContext { get; set; }
        public IFacebookService FBService { get; set; }        

        public FacebookUserController(ISocNetworkService socNetService, IComponentContext componentContext, ILogger log, IDbOperations db) : base(log, db)
        {
            SocNetService = socNetService;
			ComponentContext = componentContext;            
		}
        
        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] FacebookUserAuthenticationRequest req)
        {
            var auth = new SocAuthDO
            {
                UserId = UserId,
                AccessToken = req.accessToken,
                TokenSecret = null,
                ExpiresAt = DateTime.UtcNow.AddSeconds(req.expiresIn),
                SocUserId = req.userId,
                NetType = SocialNetworkType.Facebook
            };

            SocNetService.SocLogin = ComponentContext.ResolveKeyed<ISocLogin>("Facebook");
            
            var res = await SocNetService.HandleAsync(auth);
            return new ObjectResult(res);            
        }        
    }
}