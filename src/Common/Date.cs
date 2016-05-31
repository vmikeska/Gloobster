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
    }

    public static class Exts
    {
        public static Date ToDate(this string str)
        {
            var prms = str.Split('/');
            return new Date(int.Parse(prms[0]), int.Parse(prms[1]), int.Parse(prms[2]));
        }

        public static Date ToDate(this DateTime date)
        {
            return new Date(date.Day, date.Month, date.Year);
        }

        //public static Date ToDate(this DateTime)
    }
}