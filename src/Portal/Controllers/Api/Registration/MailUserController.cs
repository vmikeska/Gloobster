using System.Threading.Tasks;
using Autofac;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Gloobster.ReqRes.User;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Registration
{
	[Route("api/[controller]")]
	public class MailUserController : BaseApiController
	{
        public ISocNetworkService SocNetService { get; set; }
        public IComponentContext ComponentContext { get; set; }
		
		public MailUserController(ISocNetworkService socNetService, IComponentContext componentContext, ILogger log, IDbOperations db) : base(log, db)
		{
            SocNetService = socNetService;
            ComponentContext = componentContext;
		}

		[HttpPost]
        [AuthorizeApi]
		public async Task<IActionResult> Post([FromBody] UserRegistrationRequest reg)
		{			
		    var res = await SocNetService.HandleEmail(reg.mail, reg.password, UserId);
            return new ObjectResult(res);
        }

		


	}
}