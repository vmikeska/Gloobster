using System.Linq;
using Gloobster.Database;
using Gloobster.Entities.Trip;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Trip
{
	public class FilesUsageController : BaseApiController
	{
		
		public FilesUsageController(ILogger log, IDbOperations db) : base(log, db)
		{
		
		}

		[HttpGet]
		[AuthorizeApi]
		public IActionResult Get()
		{
		    const int max = 300;

		    var trips = DB.List<TripEntity>(t => t.User_id == UserIdObj);
		    var files = trips.SelectMany(f => f.Files);
		    decimal currentSize = files.Sum(f => f.FileSize);

		    bool canUpload = (currentSize < max);
			return new ObjectResult(canUpload);
		}


		
	}
}