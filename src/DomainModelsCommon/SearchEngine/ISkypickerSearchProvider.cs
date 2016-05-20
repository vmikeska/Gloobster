using System.Collections.Generic;
using Gloobster.DomainObjects.SearchEngine;

namespace Gloobster.DomainInterfaces.SearchEngine
{
    public interface ISkypickerSearchProvider
    {
        FlightSearchDO Search(FlightRequestDO query);
    }
}