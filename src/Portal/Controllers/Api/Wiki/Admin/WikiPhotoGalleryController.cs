using System.Threading.Tasks;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels;
using Gloobster.DomainModels.Wiki;
using Gloobster.DomainObjects;
using Gloobster.Portal.Controllers.Base;
using Gloobster.ReqRes.Files;
using Microsoft.AspNet.Mvc;
using Serilog;
using Gloobster.ReqRes;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public class WikiPhotoGalleryController : BaseApiController
    {
        public FilesDomain FileDomain { get; set; }                
        public IArticlePhoto ArticlePhoto { get; set; }

        public WikiPhotoGalleryController(IArticlePhoto articlePhoto, IFilesDomain filesDomain, ILogger log, IDbOperations db) : base(log, db)
        {
            FileDomain = (FilesDomain) filesDomain;                        
            ArticlePhoto = articlePhoto;
        }
        
        [HttpPut]
        [AuthorizeApi]
        public async Task<IActionResult> Put([FromBody] UpdateConfirmedRequest req)
        {
            bool confirmed = await ArticlePhoto.Confirm(UserId, req.articleId, req.photoId);

            if (!confirmed)
            {
                return HttpUnauthorized();
            }

            return new ObjectResult(confirmed);
        }

        [HttpDelete]
        [AuthorizeApi]
        public IActionResult Delete(string articleId, string photoId)
        {
            bool deleted = ArticlePhoto.Delete(UserId, articleId, photoId);

            if (!deleted)
            {
                return HttpUnauthorized();
            }

            return new ObjectResult(deleted);
        }

        [HttpPost]
        [AuthorizeApi]
        public IActionResult Post([FromBody] FileRequest request)
        {
            string articleId = null;
            string sectionId = null;
            var idPrms = request.customId.Split(',');
            if (idPrms.Length > 1)
            {
                articleId = idPrms[0];
                sectionId = idPrms[1];
            }
            else
            {
                articleId = request.customId;
            }
            
            var articleDir = FileDomain.Storage.Combine(WikiFileConstants.FileLocation, articleId);

            var filePartDo = new WriteFilePartDO
            {
                Data = request.data,
                UserId = UserId,
                FileName = request.fileName,
                FilePart = request.filePartType,
                FileLocation = articleDir,
                FileType = request.type
            };

            var res = ArticlePhoto.ReceiveFilePart(articleId, UserId, filePartDo, sectionId);
            return new ObjectResult(res);

        }
    }
}