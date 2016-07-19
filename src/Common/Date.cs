using System;

namespace Gloobster.Common
{
    public class Date
    {
        public Date(int day, int month, int year)
        {
            Day = day;
            Month = month;
            Year = year;
        }

        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }

        public override string ToString()
        {
            return $"{Day}/{Month}/{Year}";
        }

        public bool IsGreaterOrEqualThen(Date date)
        {
            if (Year < date.Year) return false;
            if (Month < date.Month) return false;
            if (Day <= date.Day) return false;

            //if (Day == date.Day)
            //{
            //    return false;
            //}

            return true;
        }

        public bool IsLowerOrEqualThen(Date date)
        {
            if (Year > date.Year) return false;
            if (Month > date.Month) return false;
            if (Day >= date.Day) return false;

            //if (Day == date.Day)
            //{
            //    return false;
            //}

            return true;
        }
    }

    public static class Exts
    {
        public static Date ToDate(this string str, char? spliter = null)
        {
            char s = spliter ?? '/';

            var prms = str.Split(s);
            return new Date(int.Parse(prms[0]), int.Parse(prms[1]), int.Parse(prms[2]));
        }
        
        public static Date ToDate(this DateTime date)
        {
            return new Date(date.Day, date.Month, date.Year);
        }

        public static DateTime ToDateEnd(this Date date, DateTimeKind kind)
        {
            var dateTime = new DateTime(date.Year, date.Month, date.Day, 23, 59, 59, kind);
            return dateTime;
        }
        
    }
}