namespace Gloobster.DomainModels.SearchEngine8
{
    public class ParamsParsers
    {
        public static WeekendParams Weekend(string prms)
        {
            var ps = prms.Split('_');
            return new WeekendParams
            {
                Week = int.Parse(ps[0]),
                Year = int.Parse(ps[1])
            };
        }

        public static string Weekend(int week, int year)
        {
            var str = $"{week}_{year}";
            return str;
        }

        public static CustomParams Custom(string prms)
        {
            var ps = prms.Split('_');
            return new CustomParams
            {
                UserId = ps[0],
                SearchId = ps[1]
            };            
        }

        public static string Custom(string userId, string searchId)
        {
            var str = $"{userId}_{searchId}";
            return str;
        }
        

    }

    public class CustomParams
    {
        public string UserId;
        public string SearchId;
    }

    public class WeekendParams
    {
        public int Week;
        public int Year;
    }
}