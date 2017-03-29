using System.Collections.Generic;

namespace Gloobster.ReqRes
{
    public class QuizRespReq
    {
        public string specAction { get; set; }

        public string id { get; set; }
        public int no { get; set; }
        public string title { get; set; }
        public string titleUrl { get; set; }
        public string lang { get; set; }
        public bool active { get; set; }

        public List<QuizItemRespReq> items { get; set; }
    }

    public class QuizItemRespReq
    {
        public string id { get; set; }
        public int no { get; set; }
        public string question { get; set; }
        public bool hasPhoto { get; set; }
        public List<QuizOptionRespReq> options { get; set; }
        public int? correctNo { get; set; }
    }

    public class QuizOptionRespReq
    {
        public int no { get; set; }
        public string text { get; set; }
    }


    public class QuizGetRequest
    {
        public bool getEmptyNumber { get; set; }
        public bool list { get; set; }

        public string id { get; set; }
        public string lang { get; set; }
        public int no { get; set; }

    }
}