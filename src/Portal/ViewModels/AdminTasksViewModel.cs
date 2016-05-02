using System.Collections.Generic;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using MongoDB.Bson;
using Gloobster.Database;

namespace Gloobster.Portal.ViewModels
{
    public class AdminTasksViewModel : ViewModelBase
    {
        public List<TaskDO> Tasks { get; set; }

        public IDbOperations DB;

        public WikiTextsEntity GetTextsByArticleId(ObjectId articleId)
        {
            var entity = DB.FOD<WikiTextsEntity>(a => a.Article_id == articleId);
            return entity;
        }

        public UserEntity GetCreatorUser(ObjectId id)
        {
            var entity = DB.FOD<UserEntity>(a => a.User_id == id);
            return entity;
        }

        public WikiReportEntity GetReport(ObjectId id)
        {
            var entity = DB.FOD<WikiReportEntity>(a => a.id == id);
            return entity;
        }
    }


}