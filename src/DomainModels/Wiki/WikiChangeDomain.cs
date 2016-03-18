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