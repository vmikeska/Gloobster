using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities.TravelB;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using MongoDB.Bson;
using System.Linq;
using FourSquare.SharpSquare.Entities;
using Gloobster.DomainInterfaces;
using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    //service is unused, untested, can be deleted
    public class PlacePhotoController : BaseApiController
    {
        public IFoursquareService FoursquareSvc;

        public PlacePhotoController(ILogger log, IDbOperations db) : base(log, db)
        {

        }

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get(List<PlacePhotoRequest> reqs)
        {
            var results = new List<PlacePhotoResult>();

            foreach (var req in reqs)
            {
                if (req.sourceType == SourceType.S4)
                {
                    var prms = new Dictionary<string, string>();
                    List<Photo> response = FoursquareSvc.Client.GetVenuePhotos(req.sourceId, prms);

                    if (response == null || !response.Any())
                    {
                        continue;
                    }

                    var photo = response.First();
                    var url = $"{photo.prefix}width{req.width}{photo.suffix}";
                    var res = new PlacePhotoResult
                    {
                        sourceId = req.sourceId,
                        sourceType = req.sourceType,
                        url = url
                    };
                    results.Add(res);
                }
            }
            
            return new ObjectResult(null);
        }
    }

    public class PlacePhotoResult
    {
        public string sourceId { get; set; }
        public SourceType sourceType { get; set; }
        public string url { get; set; }
    }

    public class PlacePhotoRequest
    {
        public string sourceId { get; set; }
        public SourceType sourceType { get; set; }
        public int width { get; set; }
    }
}
