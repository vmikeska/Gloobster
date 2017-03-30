using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using MongoDB.Bson;
using Gloobster.Mappers;
using Gloobster.ReqRes;
using Serilog;

namespace Gloobster.Portal.Controllers.Api.Wiki.Admin
{

    public class QuizController : BaseApiController
    {
        public IWikiPermissions WikiPerms { get; set; }
        public IFilesDomain FilesDomain { get; set; }

        public QuizController(IFilesDomain filesDomain, IWikiPermissions wikiPerms, ILogger log, IDbOperations db) : base(log, db)
        {
            WikiPerms = wikiPerms;
            FilesDomain = filesDomain;
        }




        [HttpGet]
        [AuthorizeApi]
        public async Task<IActionResult> Get(QuizGetRequest req)
        {
            if (!WikiPerms.IsSuperOrMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            if (req.getEmptyNumber)
            {
                var nos = DB.C<QuizEntity>().Select(q => q.No).ToList();

                int maxNo = nos.Any() ? nos.Max() : 0;
                int newNo = maxNo + 1;
                return new ObjectResult(newNo);
            }

            var lang = string.IsNullOrEmpty(req.lang) ? "en" : req.lang;

            if (req.list)
            {
                var list = DB.List<QuizEntity>(l => l.Lang == req.lang);

                var lt = list.Select(l => l.ToResponse()).ToList();
                return new ObjectResult(lt);
            }

            if (!string.IsNullOrEmpty(req.id))
            {
                var qid = new ObjectId(req.id);
                var item = DB.FOD<QuizEntity>(l => l.id == qid);
                QuizRespReq li = item.ToResponse();
                EnrichPhotos(li);
                return new ObjectResult(li);
            }

            if (req.no != 0)
            {
                var item = DB.FOD<QuizEntity>(l => l.No == req.no && l.Lang == lang);
                var li = item.ToResponse();
                EnrichPhotos(li);
                return new ObjectResult(li);
            }

            return new ObjectResult(null);
        }

        private void EnrichPhotos(QuizRespReq a)
        {
            foreach (var i in a.items)
            {
                var filePath = QuizPhotoConsts.GetFilePath(FilesDomain, a.no, i.no);

                bool exists = FilesDomain.Storage.FileExists(filePath);
                i.hasPhoto = exists;
            }
        }

        [HttpDelete]
        [AuthorizeApi]
        public async Task<IActionResult> Delete(int no)
        {
            if (!WikiPerms.IsSuperOrMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            var qs = DB.List<QuizEntity>(q => q.No == no);

            foreach (var q in qs)
            {
                await DB.DeleteAsync<QuizEntity>(q.id);
            }

            return new ObjectResult(null);
        }



        [HttpPost]
        [AuthorizeApi]
        public async Task<IActionResult> Post([FromBody] QuizRespReq req)
        {
            if (!WikiPerms.IsSuperOrMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            var lang = string.IsNullOrEmpty(req.lang) ? "en" : req.lang;

            var entity = req.ToEntity();
            entity.id = ObjectId.GenerateNewId();
            entity.Lang = lang;

            foreach (var item in entity.Items)
            {
                item.id = ObjectId.GenerateNewId();
            }

            await DB.SaveAsync(entity);

            return new ObjectResult(entity.id.ToString());
        }



        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody] QuizRespReq req)
        {
            if (!WikiPerms.IsSuperOrMasterAdmin(UserId))
            {
                return HttpUnauthorized();
            }

            if (!string.IsNullOrEmpty(req.specAction))
            {
                if (req.specAction == "activate")
                {
                    var u = DB.F<QuizEntity>().Eq(a => a.No, req.no);
                    var f = DB.U<QuizEntity>().Set(b => b.Active, true);
                    await DB.UpdateAsync(u, f);
                }

                return new ObjectResult(true);
            }

            var lang = string.IsNullOrEmpty(req.lang) ? "en" : req.lang;

            var entity = req.ToEntity();
            entity.Lang = lang;

            await DB.ReplaceOneAsync(entity);

            return new ObjectResult(true);
        }

    }




}