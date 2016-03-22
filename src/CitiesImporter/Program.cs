using System;
using System.Linq;
using System.Threading.Tasks;

namespace CitiesImporter
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Import.LoadCities();
            Import.SaveCities(10000, 0);
        }
    }
}
