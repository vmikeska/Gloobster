using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.DomainInterfaces.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities;
using Gloobster.Entities.SearchEngine;
using Gloobster.Enums.SearchEngine;
using Gloobster.Mappers;

namespace Gloobster.DomainModels.SearchEngine
{
    public class StopRating
    {
        public StopRating(int count, double rating)
        {
            Count = count;
            Rating = rating;
        }
        
        public int Count;
        public double Rating;
    }
}