using System.Collections.Generic;
using Gloobster.Database;
using MongoDB.Bson;

namespace Gloobster.Entities
{
    public class QuizEntity : EntityBase
    {
        public int No { get; set; }
        public string Title { get; set; }
        public string TitleUrl { get; set; }
        public string Lang { get; set; }
        public bool Active { get; set; }
        public List<QuizItemSE> Items { get; set; }
    }

    public class QuizItemSE
    {
        public ObjectId id { get; set; }
        public int No { get; set; }
        public string Question { get; set; }
        public List<QuizOptionSE> Options { get; set; }
        public int? CorrectNo { get; set; }
    }

    public class QuizOptionSE
    {
        public int No { get; set; }
        public string Text { get; set; }
    }



}