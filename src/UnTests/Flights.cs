using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.FlightsSearch;
using Xunit;

namespace Gloobster.UnitTests
{
    public class Flights
    {
        [Fact]
        public void should_find_something()
        {
            var test = new TestCall();
            test.GetResults();
        }
    }
}
