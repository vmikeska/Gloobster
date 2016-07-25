using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
    public class TripFilePublicController : BaseApiController
	{		
		public IFilesDomain FileDomain { get; set; }
		

		public TripFilePublicController(IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
		{			
			FileDomain = filesDomain;			
		}
		
		[HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] TripFilePublicRequest req)
		{
		    bool res = await FileDomain.ChangeFilePublic(req.tripId, req.fileId, req.state);

			return new ObjectResult(res);
		}
        
	}

    public class TripFilePublicRequest
    {
        public string tripId { get; set; }
        public string fileId { get; set; }
        public bool state { get; set; } 
    }
}