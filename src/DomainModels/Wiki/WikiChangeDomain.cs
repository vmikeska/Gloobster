using System;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainObjects;
using Gloobster.Entities.Wiki;
using MongoDB.Bson;
using System.Linq;

namespace Gloobster.DomainModels.Wiki
{
    public class WikiChangeDomain : IWikiChangeDomain
    {
        public IDbOperations DB { get; set; }

        public WikiEventDO GetOlderVersion(VersionDO version)
        {
            var articleIdObj = new ObjectId(version.ArticleId);

            var changes = DB.C<WikiChangeEventEntity>()
                .Where(a => 
                    a.Article_id == articleIdObj 
                    && a.AddId == version.AddId
                    && a.Lang == version.Lang)
                .OrderByDescending(o => o.Created)
                .ToList();

            if (version.Position > (changes.Count - 1))
            {
                version.Position = (changes.Count - 1);
            }
            if (version.Position < 0)
            {
                version.Position = 0;
            }

            var change = changes[version.Position];

            var changeDO = new WikiEventDO
            {
                Id = change.id.ToString(),
                Value = change.Value,
                Created = change.Created,
                Lang = change.Lang,
                Values = change.Values?.Select(v => new ValueDO
                {
                    Value = v.Value,
                    Key = v.Key
                }).ToList(),
                ArticleId = change.Article_id.ToString(),
                AddId = change.AddId,
                OldValue = change.OldValue,
                EventType = change.EventType
            };

            return changeDO;
        }

        public void ReceiveEvent(WikiEventDO evnt)
        {
            var entity = new WikiChangeEventEntity
            {
                id = ObjectId.GenerateNewId(),
                EventType = evnt.EventType,
                Lang = evnt.Lang,
                Article_id = new ObjectId(evnt.ArticleId),
                AddId = evnt.AddId,
                Value = evnt.Value,
                Values = evnt.Values?.Select(v => new ValueSE
                {
                    Value = v.Value,
                    Key = v.Key
                }).ToList(),
                Created = DateTime.UtcNow,
                OldValue = evnt.OldValue
            };

            DB.SaveAsync(entity);            
        }
    }
}