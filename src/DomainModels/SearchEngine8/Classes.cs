using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainModels.SearchEngine;
using Gloobster.DomainObjects.SearchEngine;
using Gloobster.Entities;
using Gloobster.Entities.SearchEngine;
using Gloobster.Mappers;
using Hammock;
using MongoDB.Bson;

namespace Gloobster.DomainModels.SearchEngine8
{
    
    
    
    public class WeeksCombi
    {
        public int Year { get; set; }
        public int WeekNo { get; set; }        
    }


    

    public class DateRange
    {
        public Date FromDate { get; set; }
        public Date ToDate { get; set; }
    }

    
    
    //---inters-----

    

}
