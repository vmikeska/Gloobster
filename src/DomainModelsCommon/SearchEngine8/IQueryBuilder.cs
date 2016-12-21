using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface IQueryBuilder
    {
        FlightRequestDO BuildCountry(string airCode, string cc);
        FlightRequestDO BuildCity(string airCode, int gid);
    }
}