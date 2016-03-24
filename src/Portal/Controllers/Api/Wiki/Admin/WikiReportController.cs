using System;
using System.Collections.Generic;
using System.Globalization;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Serilog;
using System.Linq;
using Autofac;
using Gloobster.DomainModels.Wiki;
using Gloobster.Entities;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class WikiReportController : BaseApiController
    {
        public IWikiReportDomain ReportDomain { get; set; }

        public WikiReportController(IWikiReportDomain reportDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            ReportDomain = reportDomain;
        }
        
        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] ReportRequest req)
        {
            var report = new NewReportDO
            {
                Lang = req.lang,
                Text = req.text,
                UserId = UserId,
                ArticleId = req.articleId,
                SectionId = req.sectionId
            };

            bool res = await ReportDomain.CreateReport(report);            
            return new ObjectResult(res);
        }

    }

    
}