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
		public IUserService UserService { get; set; }		
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


            //var accountDriver = ComponentContext.ResolveKeyed<IAccountDriver>("Twitter");
            //UserService.AccountDriver = accountDriver;

            //var addInfo = new TwitterUserAddtionalInfoDO
            //{
            //	Mail = request.mail
            //};

            //var auth = new SocAuthenticationDO
            //{
            //	AccessToken = request.accessToken,
            //	UserId = request.userId,
            //	TokenSecret = request.tokenSecret,
            //	ExpiresAt = DateTime.Parse(request.expiresAt)
            //};

            //var result = await UserService.Validate(auth, addInfo);
            //Request.HttpContext.Session.SetString(PortalConstants.UserSessionId, result.UserId);

            //var response = new LoggedResponse
            //{
            //	encodedToken = result.EncodedToken,
            //	status = result.Status.ToString(),
            //	networkType = SocialNetworkType.Twitter
            //};

            //return new ObjectResult(response);			
            return null;
		}
	}
}