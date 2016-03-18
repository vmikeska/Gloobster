using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki
{

	public class WikiUpdateController: BaseApiController
	{
        public IWikiUpdateDomain WikiUpdate { get; set; }
        public IWikiPermissions WikiPerms { get; set; }

        public WikiUpdateController(IWikiPermissions wikiPerms, IWikiUpdateDomain wikiUpdate, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiUpdate = wikiUpdate;
            WikiPerms = wikiPerms;
        }
		
		[HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] WikiUpdateRequest req)
		{
            //todo: move to attribute
            if (!WikiPerms.HasArticleAdminPermissions(UserId, req.articleId))
            {
                return HttpUnauthorized();
            }

            await WikiUpdate.UpdateBaseSection(req.articleId, req.sectionId, req.language, req.newText);
			
			return new ObjectResult(null);
		}
        
	}
}