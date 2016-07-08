using System;
using System.Collections.Generic;
using Gloobster.Common;
using Gloobster.Enums;

namespace Gloobster.DomainObjects.TravelB
{
    public class CheckinCityDO
    {
        public string CheckinId { get; set; }
        public string UserId { get; set; }

        public List<int> WantDo { get; set; }

        public WantMeet WantMeet { get; set; }

        public bool MultiPeopleAllowed { get; set; }

        public int FromAge { get; set; }
        public int ToAge { get; set; }

        public string WaitingAtId { get; set; }
        public SourceType WaitingAtType { get; set; }
        public string WaitingAtText { get; set; }
        public LatLng WaitingCoord { get; set; }

        public Date FromDate { get; set; }
        public Date ToDate { get; set; }

        public string Message { get; set; }

    }
}