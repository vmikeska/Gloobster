using Gloobster.DomainObjects.SearchEngine8;

namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface IRequestBuilder8
    {
        FlightQuery8DO BuildQueryAnytimeCity(string fromAir, int gid);

        FlightQuery8DO BuildQueryAnytimeCountry(string fromAir, string cc);

        FlightQuery8DO BuildQueryWeekendCity(string fromAir, int gid, int week, int year);

        FlightQuery8DO BuildQueryWeekendCountry(string fromAir, string cc, int week, int year);

        FlightQuery8DO BuildQueryCustomCity(string fromAir, int gid, string userId, string searchId);

        FlightQuery8DO BuildQueryCustomCountry(string fromAir, string cc, string userId, string searchId);
    }
}