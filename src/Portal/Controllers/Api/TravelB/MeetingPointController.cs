using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.Entities.TravelB;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;
using System.Linq;
using Gloobster.Common;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.DomainModels.TravelB;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class MeetingPointController : BaseApiController
    {
        public MeetingPointController(ILogger log, IDbOperations db) : base(log, db)
        {

        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] MeetingPointReqRes req)
        {
            var entity = new MeetingPointsEntity
            {
                id = ObjectId.GenerateNewId(),
                SourceId = req.sourceId,
                Type = req.type,
                Text = req.text,
                Coord = req.coord
            };

            await DB.SaveAsync(entity);

            var ls = new MeetingPointReqRes
            {
                id = entity.id.ToString(),
                sourceId = entity.SourceId,
                text = entity.Text,
                type = entity.Type,
                coord = entity.Coord
            };

            return new ObjectResult(ls);
        }

        [AuthorizeApi]
        [HttpGet]
        public async Task<IActionResult> Get(MeetingPointsQueryRequest req)
        {
            var result = new List<MeetingPointReqRes>();

            if (req.all)
            {
                var list = DB.List<MeetingPointsEntity>();
                result = list.Select(Convert).ToList();
            }
            else
            {
                result = GetMpsInRect(req);
            }

            return new ObjectResult(result);
        }

        private List<MeetingPointReqRes> GetMpsInRect(MeetingPointsQueryRequest req)
        {
            var rect = new RectDO
            {
                LngWest = req.lngWest,
                LngEast = req.lngEast,
                LatNorth = req.latNorth,
                LatSouth = req.latSouth
            };

            var mps = DB.List<MeetingPointsEntity>();

            var outMps = new List<MeetingPointsEntity>();
            foreach (var mp in mps)
            {
                bool withinRect = CheckinUtils.WithinRectangle(rect, mp.Coord);
                if (withinRect)
                {
                    outMps.Add(mp);
                }
            }

            return outMps.Select(Convert).ToList();
        }

        private MeetingPointReqRes Convert(MeetingPointsEntity l)
        {
            var mp = new MeetingPointReqRes
            {
                id = l.id.ToString(),
                sourceId = l.SourceId,
                text = l.Text,
                type = l.Type,
                coord = l.Coord
            };
            return mp;
        }
    }

    public class MeetingPointsQueryRequest
    {
        public bool all { get; set; }

        public double latSouth { get; set; }
        public double lngWest { get; set; }
        public double latNorth { get; set; }
        public double lngEast { get; set; }
    }

    public class MeetingPointReqRes
    {
        public string id { get; set; }

        public string sourceId { get; set; }
        public SourceType type { get; set; }
        public string text { get; set; }
        public LatLng coord { get; set; }
    }
}