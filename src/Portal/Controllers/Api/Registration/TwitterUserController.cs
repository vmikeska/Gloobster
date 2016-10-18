using System;
using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Gloobster.ReqRes.Facebook;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Registration
{
	[Route("api/[controller]")]
	public class TwitterUserController : BaseApiController
	{		
		public IComponentContext ComponentContext { get; set; }
        public ISocNetworkService SocNetService { get; set; }

        public TwitterUserController(ISocNetworkService socNetService, IComponentContext componentContext, ILogger log, IDbOperations db) : base(log, db)
		{
            SocNetService = socNetService;            
			ComponentContext = componentContext;
		}

		[HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] TwitterUserAuthenticationRequest req)
		{
            var auth = new SocAuthDO
            {
                UserId = UserId,
                AccessToken = req.accessToken,
                TokenSecret = req.tokenSecret,                
                SocUserId = req.userId,
                NetType = SocialNetworkType.Twitter
            };

            SocNetService.SocLogin = ComponentContext.ResolveKeyed<ISocLogin>("Twitter");

            var res = await SocNetService.HandleAsync(auth);
            return new ObjectResult(res);            
		}

        [HttpDelete]
        [AuthorizeApi]
        public async Task<IActionResult> Delete()
        {
            var res = await SocNetService.Unpair(UserId, SocialNetworkType.Twitter);
            return new ObjectResult(res);
        }

    }
}