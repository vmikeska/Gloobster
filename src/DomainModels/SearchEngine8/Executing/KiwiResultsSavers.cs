using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.Mappers;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine8.Executing
{
    public class KiwiAnytimeResultsSaver        
    {
        public List<AnytimeResultsEntity> BuildEntities(List<GroupedResultDO> groups, string queryId)
        {
            var qid = new ObjectId(queryId);

            var entities = new List<AnytimeResultsEntity>();

            foreach (var group in groups)
            {                                
                var flightsSE = group.Flights.Select(f => f.ToEntity()).ToList();

                var resEnt = new AnytimeResultsEntity
                {
                    id = ObjectId.GenerateNewId(),
                    Query_id = qid,

                    FromAir = group.From,
                    ToAir = group.To,

                    CC = group.CC,
                    GID = group.GID,
                    Name = group.Name,

                    Flights = flightsSE                    
                };
                
                entities.Add(resEnt);
            }

            return entities;
        }
    }

    public class KiwiWeekendResultsSaver        
    {
        private int _week;
        private int _year;

        public KiwiWeekendResultsSaver(int week, int year)
        {
            _week = week;
            _year = year;
        }

        public List<WeekendResultsEntity> BuildEntities(List<GroupedResultDO> groups, string queryId)
        {
            var qid = new ObjectId(queryId);

            var entities = new List<WeekendResultsEntity>();

            foreach (var group in groups)
            {
                var flightsSE = group.Flights.Select(f => f.ToEntity()).ToList();

                var resEnt = new WeekendResultsEntity
                {
                    id = ObjectId.GenerateNewId(),
                    Query_id = qid,

                    FromAir = group.From,
                    ToAir = group.To,

                    CC = group.CC,
                    GID = group.GID,
                    Name = group.Name,

                    Week = _week,
                    Year = _year,

                    Flights = flightsSE
                };

                entities.Add(resEnt);
            }

            return entities;
        }
    }

    public class KiwiCustomResultsSaver        
    {
        private string _customId;
        private string _userId;

        public KiwiCustomResultsSaver(string userId, string customId)
        {
            _customId = customId;
            _userId = userId;
        }

        public List<CustomResultsEntity> BuildEntities(List<GroupedResultDO> groups, string queryId)
        {
            var qid = new ObjectId(queryId);

            var entities = new List<CustomResultsEntity>();

            foreach (var group in groups)
            {
                var flightsSE = group.Flights.Select(f => f.ToEntity()).ToList();

                var resEnt = new CustomResultsEntity
                {
                    id = ObjectId.GenerateNewId(),
                    Query_id = qid,

                    FromAir = group.From,
                    ToAir = group.To,

                    CC = group.CC,
                    GID = group.GID,
                    Name = group.Name,

                    CustomId = _customId,
                    UserId = _userId,

                    Flights = flightsSE
                };

                entities.Add(resEnt);
            }

            return entities;
        }
    }
    
}
