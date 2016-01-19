using System;
using System.Collections.Generic;

namespace Gloobster.DomainObjects
{
    public class VisitedStateDO : IEquatable<VisitedStateDO>
    {
        public string PortalUserId { get; set; }
        public List<DateTime> Dates { get; set; }
        public int Count { get; set; }

        public string StateCode { get; set; }
        public bool Equals(VisitedStateDO other)
        {
            return this.StateCode == other.StateCode;
        }
    }
}