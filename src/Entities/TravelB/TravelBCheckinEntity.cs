using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Entities.TravelB
{
    public class TravelBCheckinEntity : EntityBase
    {
        public ObjectId User_id { get; set; }

        public int WantDo { get; set; }

        public WantMeet WantMeet { get; set; }

        public bool MultiPeopleAllowed { get; set; }

        public int FromAge { get; set; }
        public int ToAge { get; set; }

        public DateTime WaitingUntil { get; set; }
        
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

        public CheckinType CheckinType { get; set; }
        public string WaitingAtId { get; set; }
        public SourceType WaitingAtType { get; set; }
        public string WaitingAtText { get; set; }
        public LatLng WaitingCoord { get; set; }

    }
}
