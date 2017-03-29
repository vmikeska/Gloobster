using System.Linq;
using Gloobster.Entities;
using Gloobster.ReqRes;
using MongoDB.Bson;

namespace Gloobster.Portal.Controllers.Api.Wiki
{
    public static class QuizMappers
    {
        public static QuizRespReq ToResponse(this QuizEntity e)
        {
            var r = new QuizRespReq
            {
                id = e.id.ToString(),
                lang = e.Lang,
                no = e.No,
                title = e.Title,
                titleUrl = e.TitleUrl,
                active = e.Active
            };

            if (e.Items != null)
            {
                r.items = e.Items.Select(i => ToResponse((QuizItemSE) i)).ToList();
            }

            return r;
        }

        public static QuizItemRespReq ToResponse(this QuizItemSE e)
        {
            var r = new QuizItemRespReq
            {
                id = e.id.ToString(),
                question = e.Question,
                no = e.No,
                correctNo = e.CorrectNo
            };

            if (e.Options != null)
            {
                r.options = e.Options.Select(s => s.ToResponse()).ToList();
            }

            return r;
        }

        public static QuizOptionRespReq ToResponse(this QuizOptionSE e)
        {
            var r = new QuizOptionRespReq
            {
                no = e.No,
                text = e.Text,                
            };

            return r;
        }

        public static QuizEntity ToEntity(this QuizRespReq r)
        {
            var e = new QuizEntity
            {
                Active = r.active,
                Lang = r.lang,
                No = r.no,
                Title = r.title,
                TitleUrl = r.titleUrl,
            };

            if (!string.IsNullOrEmpty(r.id))
            {
                e.id = new ObjectId(r.id);
            }

            if (r.items != null)
            {
                e.Items = r.items.Select(i => i.ToEntity()).ToList();
            }

            return e;
        }

        public static QuizItemSE ToEntity(this QuizItemRespReq r)
        {
            var e = new QuizItemSE
            {
                Question = r.question,
                No = r.no,
                CorrectNo = r.correctNo
            };

            if (!string.IsNullOrEmpty(r.id))
            {
                e.id = new ObjectId(r.id);
            }

            if (r.options != null)
            {
                e.Options = r.options.Select(i => i.ToEntity()).ToList();
            }

            return e;
        }

        public static QuizOptionSE ToEntity(this QuizOptionRespReq r)
        {
            var e = new QuizOptionSE
            {
                No = r.no,
                Text = r.text,                
            };

            return e;
        }
    }
}