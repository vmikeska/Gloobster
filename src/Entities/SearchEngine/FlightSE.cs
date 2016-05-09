using System.Linq;
using System.Threading.Tasks;
using Gloobster.Database;

namespace Gloobster.Entities.SearchEngine
{
    public class FlightSE 
    {
        public string From { get; set; }
        public string To { get; set; }

        public decimal Price { get; set; }
        public int Stops { get; set; }
        public decimal HoursDuration { get; set; }
    }
}
