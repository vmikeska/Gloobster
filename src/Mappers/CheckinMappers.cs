using Gloobster.DomainObjects.TravelB;
using Gloobster.Entities.TravelB;
using MongoDB.Bson;

namespace Gloobster.Mappers
{
    public static class CheckinMappers
    {
        public static CheckinNowDO ToDO(this CheckinNowEntity e)
        {
            var d = new CheckinNowDO
            {
                CheckinId = e.id.ToString(),
                UserId = e.User_id.ToString(),
                MultiPeopleAllowed = e.MultiPeopleAllowed,
                WaitingAtId = e.WaitingAtId,
                WaitingAtType = e.WaitingAtType,
                WaitingCoord = e.WaitingCoord,
                WantDo = e.WantDo,
                WaitingAtText = e.WaitingAtText,
                FromAge = e.FromAge,
                WaitingUntil = e.WaitingUntil,
                WantMeet = e.WantMeet,
                ToAge = e.ToAge,
                Message = e.Message
            };

            return d;
        }

        public static CheckinCityDO ToDO(this CheckinCityEntity e)
        {
            var d = new CheckinCityDO
            {
                CheckinId = e.id.ToString(),
                UserId = e.User_id.ToString(),
                MultiPeopleAllowed = e.MultiPeopleAllowed,
                WaitingAtId = e.WaitingAtId,
                WaitingAtType = e.WaitingAtType,
                WaitingCoord = e.WaitingCoord,
                FromDate = e.FromDate,
                ToDate = e.ToDate,
                WantDo = e.WantDo,
                WaitingAtText = e.WaitingAtText,
                FromAge = e.FromAge,
                WantMeet = e.WantMeet,
                ToAge = e.ToAge,
                Message = e.Message,
                ValidUntil = e.ValidUntil
            };

            return d;
        }

        public static CheckinCityEntity ToEntity(this CheckinCityDO d)
        {
            var e = new CheckinCityEntity
            {                
                User_id = new ObjectId(d.UserId),
                MultiPeopleAllowed = d.MultiPeopleAllowed,
                WaitingAtId = d.WaitingAtId,
                WaitingAtType = d.WaitingAtType,
                WaitingCoord = d.WaitingCoord,
                FromDate = d.FromDate,
                ToDate = d.ToDate,
                WantDo = d.WantDo,
                WaitingAtText = d.WaitingAtText,
                FromAge = d.FromAge,
                WantMeet = d.WantMeet,
                ToAge = d.ToAge,
                Message = d.Message,
                ValidUntil = d.ValidUntil
            };

            if (!string.IsNullOrEmpty(d.CheckinId))
            {
                e.id = new ObjectId(d.CheckinId);
            }

            return e;
        }

        public static CheckinNowEntity ToEntity(this CheckinNowDO d)
        {
            var e = new CheckinNowEntity
            {                
                User_id = new ObjectId(d.UserId),
                MultiPeopleAllowed = d.MultiPeopleAllowed,
                WaitingAtId = d.WaitingAtId,
                WaitingAtType = d.WaitingAtType,
                WaitingCoord = d.WaitingCoord,
                WantDo = d.WantDo,
                WaitingAtText = d.WaitingAtText,
                FromAge = d.FromAge,
                WaitingUntil = d.WaitingUntil,
                WantMeet = d.WantMeet,
                ToAge = d.ToAge,
                Message = d.Message
            };
            
            if (!string.IsNullOrEmpty(d.CheckinId))
            {
                e.id = new ObjectId(d.CheckinId);
            }

            return e;
        }

    }
}