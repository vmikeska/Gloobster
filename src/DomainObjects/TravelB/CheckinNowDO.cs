using Gloobster.Common;
using Gloobster.Enums;
using System;

namespace Gloobster.DomainObjects.TravelB
{
    public class CheckinNowDO
    {
        public string CheckinId { get; set; }
        public string UserId { get; set; }

        public int WantDo { get; set; }

        public WantMeet WantMeet { get; set; }

        public bool MultiPeopleAllowed { get; set; }

        public int FromAge { get; set; }
        public int ToAge { get; set; }

        public string WaitingAtId { get; set; }
        public SourceType WaitingAtType { get; set; }
        public string WaitingAtText { get; set; }
        public LatLng WaitingCoord { get; set; }

        public DateTime WaitingUntil { get; set; }
    }
}
