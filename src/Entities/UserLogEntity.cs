using System;
using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities
{
    public enum LogType { Trip, Pins, Friend}

    public class UserLogEntity: EntityBase
    {
        public ObjectId User_id { get; set; }

        public List<UserLogSE> Logs { get; set; }

    }

    public class UserLogSE
    {
        public ObjectId id { get; set; }
        public ObjectId Major_id { get; set; }

        public DateTime Created { get; set; }

        public LogType Type { get; set; }
        
        public string Param1 { get; set; }
        public string Param2 { get; set; }


    }
}