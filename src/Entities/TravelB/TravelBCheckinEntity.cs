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
    public class CheckinReactionEntity : EntityBase
    {
        public ObjectId AskingUser_id { get; set; }
        public ObjectId TargetUser_id { get; set; }
        public ObjectId Checkin_id { get; set; }
        public CheckinReactionState State { get; set; }

        public List<ChatPostSE> ChatPosts { get; set; }

    }

    public class ChatPostSE
    {
        public ObjectId id { get; set; }
        public ObjectId User_id { get; set; }
        public string Text { get; set; }
        public DateTime Time { get; set; }
    }

    public class MeetingPointsEntity : EntityBase
    {
        public string SourceId { get; set; }
        public string Text { get; set; }
        public SourceType Type { get; set; }
        public LatLng Coord { get; set; }
    }


    public class CheckinNowHEntity : CheckinNowEntity
    {
        
    }

    public class CheckinNowEntity : EntityBase
    {
        public ObjectId User_id { get; set; }

        public List<int> WantDo { get; set; }

        public WantMeet WantMeet { get; set; }

        public bool MultiPeopleAllowed { get; set; }

        public int FromAge { get; set; }
        public int ToAge { get; set; }
        
        public string WaitingAtId { get; set; }
        public SourceType WaitingAtType { get; set; }
        public string WaitingAtText { get; set; }
        public LatLng WaitingCoord { get; set; }

        public DateTime WaitingUntil { get; set; }

        public string Message { get; set; }
    }

    public class CheckinCityHEntity : CheckinCityEntity
    {

    }

    public class CheckinCityEntity : EntityBase
    {        
        public ObjectId User_id { get; set; }

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
        public DateTime ValidUntil { get; set; }

        public string Message { get; set; }
    }
    
}
