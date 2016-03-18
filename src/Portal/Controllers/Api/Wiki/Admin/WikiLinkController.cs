using System.Collections.Generic;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
using Serilog;
using System.Linq;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
	public class WikiLinkController: BaseApiController
	{
        public IWikiUpdateDomain WikiUpdate { get; set; }
        public IWikiPermissions WikiPerms { get; set; }
        public IWikiChangeDomain ChangeEventSystem { get; set; }

        public WikiLinkController(IWikiChangeDomain changeEventSystem, IWikiPermissions wikiPerms, IWikiUpdateDomain wikiUpdate, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiUpdate = wikiUpdate;
            WikiPerms = wikiPerms;
            ChangeEventSystem = changeEventSystem;
        }

	    [HttpDelete]
	    [AuthorizeApi]
	    public async Task<IActionResult> Delete(DeleteLinkRequest req)
	    {
            if (!WikiPerms.HasArticleAdminPermissions(UserId, req.articleId))
            {
                return HttpUnauthorized();
            }

            var articleIdObj = new ObjectId(req.articleId);
            var linkIdObj = new ObjectId(req.linkId);
            
            var articleEntity = DB.C<WikiCityEntity>().FirstOrDefault(i => i.id == articleIdObj);
            var linkEntity = articleEntity.PlacesLinks.FirstOrDefault(i => i.id == linkIdObj);

            var f1 = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj) & DB.F<WikiCityEntity>().Eq("PlacesLinks._id", linkIdObj);
            var u1 = DB.U<WikiCityEntity>().Pull(p => p.PlacesLinks, linkEntity);
            
            var r1 = await DB.UpdateAsync(f1, u1);            
            bool deleted = r1.ModifiedCount == 1;
	        if (deleted)
	        {
	            SaveVersion(linkEntity, req.articleId, EventType.Delete);
	        }

            return new ObjectResult(deleted);
        }

        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] UpdateLinkRequest req)
        {
            if (!WikiPerms.HasArticleAdminPermissions(UserId, req.articleId))
            {
                return HttpUnauthorized();
            }

            if (req.linkId != "Temp")
            {
                return null;
            }

            var articleIdObj = new ObjectId(req.articleId);
            var linkIdObj = ObjectId.GenerateNewId();
            
            var linkEntity = new LinkObjectSE
            {
                id = linkIdObj,
                Name = req.name,
                Links = req.socLinks.Select(i =>
                {
                    var id = string.IsNullOrEmpty(i.id) ? ObjectId.GenerateNewId() : new ObjectId(i.id);

                    var newSocLink = new LinkItemSE
                    {
                        id = id,
                        SourceId = i.sid,
                        Type = i.socNetType
                    };

                    return newSocLink;
                }).ToList(),
                Category = req.category
            };
            
            var f2 = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj);
            var u2 = DB.U<WikiCityEntity>().Push(p => p.PlacesLinks, linkEntity);
            var r2 = await DB.UpdateAsync(f2, u2);
            var saved = r2.ModifiedCount == 1;
            if (saved)
            {
                SaveVersion(linkEntity, req.articleId, EventType.Create);
            }

            var linkRes = GetResponse(linkEntity);
            return new ObjectResult(linkRes);
        }

	    private void SaveVersion(LinkObjectSE linkEntity, string articleId, EventType eventType)
	    {
            var evnt = new WikiEventDO
            {
                ArticleId = articleId,
                Lang = null,
                Value = "",
                EventType = eventType,
                AddId = linkEntity.id.ToString(),
                Values = new List<ValueDO>
                    {
                        new ValueDO
                        {
                            Key = "Name",
                            Value = linkEntity.Name
                        },
                        new ValueDO
                        {
                            Key = "Category",
                            Value = linkEntity.Category
                        },
                    }
            };
            evnt.Values.AddRange(linkEntity.Links.Select(i => new ValueDO
            {
                Key = "Link",
                Value = $"{i.id}|{i.SourceId}|{i.Type}"
            }));

            ChangeEventSystem.ReceiveEvent(evnt);
        }

	    private dynamic GetResponse(LinkObjectSE l)
	    {
            var linkRes = new
            {
                name = l.Name,
                id = l.id.ToString(),
                links = l.Links.Select(i => new
                {
                    id = i.id.ToString(),
                    type = (int)i.Type,
                    sourceId = i.SourceId
                })
            };
	        return linkRes;
	    }
        
        [HttpPut]
		[AuthorizeApi]
		public async Task<IActionResult> Put([FromBody] UpdateLinkRequest req)
		{
            if (!WikiPerms.HasArticleAdminPermissions(UserId, req.articleId))
            {
                return HttpUnauthorized();
            }

            var articleIdObj = new ObjectId(req.articleId);
            var linkIdObj = new ObjectId(req.linkId);

		    var articleEntity = DB.C<WikiCityEntity>().FirstOrDefault(i => i.id == articleIdObj);
		    var linkEntity = articleEntity.PlacesLinks.FirstOrDefault(i => i.id == linkIdObj);


            var f1 = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj) & DB.F<WikiCityEntity>().Eq("PlacesLinks._id", linkIdObj);
            var u1 = DB.U<WikiCityEntity>().Pull(p => p.PlacesLinks, linkEntity);
            
            var r1 = await DB.UpdateAsync(f1, u1);

            linkEntity.Name = req.name;
		    linkEntity.Links = req.socLinks.Select(i =>
		    {
		        var id = string.IsNullOrEmpty(i.id) ? ObjectId.GenerateNewId() : new ObjectId(i.id);
                
		        var newSocLink = new LinkItemSE
		        {
		            id = id,
		            SourceId = i.sid,
                    Type = i.socNetType
		        };

		        return newSocLink;
		    }).ToList();

            var f2 = DB.F<WikiCityEntity>().Eq(p => p.id, articleIdObj);
            var u2 = DB.U<WikiCityEntity>().Push(p => p.PlacesLinks, linkEntity);
            var r2 = await DB.UpdateAsync(f2, u2);
            bool updated = (r2.ModifiedCount == 1);
            if (updated)            
            {
                SaveVersion(linkEntity, req.articleId, EventType.Update);
            }

            var linkRes = GetResponse(linkEntity);
            return new ObjectResult(linkRes);
		}
        
	}
}