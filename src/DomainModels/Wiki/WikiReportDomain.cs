using System;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace Gloobster.DomainModels.Wiki
{
    public class ReportTaskData
    {
        public string SectionName { get; set; }
        public string Text { get; set; }
        public string Report { get; set; }
        public string Lang { get; set; }
        public string CreatorName { get; set; }
    }

    public class WikiReportDomain : IWikiReportDomain
    {
        public IDbOperations DB { get; set; }
        public IWikiAdminTasks AdminTasks { get; set; }

        public async Task<bool> CreateReport(NewReportDO newReport)
        {
            var articleIdObj = new ObjectId(newReport.ArticleId);
            var sectionIdObj = new ObjectId(newReport.SectionId);

            var reportEntity = new WikiReportEntity
            {
                id = ObjectId.GenerateNewId(),
                Article_id = articleIdObj,
                Created = DateTime.UtcNow,
                Lang = newReport.Lang,
                State = AdminTaskState.New,
                Text = newReport.Text,
                Section_id = sectionIdObj,
                Creator_id = new ObjectId(newReport.UserId)
            };

            await DB.SaveAsync(reportEntity);
            
            var texts = DB.FOD<WikiTextsEntity>(e => e.Article_id == articleIdObj);            
            var sectionText = texts.Texts.FirstOrDefault(t => t.Section_id == sectionIdObj);

            
            WikiArticleBaseEntity article = null;
            if (texts.Type == ArticleType.City)
            {
                article = DB.FOD<WikiCityEntity>(c => c.id == articleIdObj);                
            }
            if (texts.Type == ArticleType.Country)
            {
                article = DB.FOD<WikiCountryEntity>(c => c.id == articleIdObj);                
            }
            var section = article.Sections.FirstOrDefault(s => s.id == sectionIdObj);
            
            var data = new ReportTaskData
            {
                SectionName = section.Type,
                Lang = newReport.Lang,
                Text = sectionText.Text,
                Report = newReport.Text            
            };

            var dataString = JsonConvert.SerializeObject(data);

            var task = new NewTaskDO
            {
                TaskType = AdminTaskType.ResolveReport,
                ArticleId = newReport.ArticleId,
                TargetId = reportEntity.id.ToString(),
                Data = dataString
            };
            AdminTasks.AddTask(task);

            return true;
        }

        public async Task<bool> SetState(string reportId, AdminTaskState state)
        {
            var reportIdObj = new ObjectId(reportId);

            var filter = DB.F<WikiReportEntity>().Eq(r => r.id, reportIdObj);
            var update = DB.U<WikiReportEntity>().Set(r => r.State, state);
            var res = await DB.UpdateAsync(filter, update);
            
            return res.ModifiedCount == 1;
        }
    }
}