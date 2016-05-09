using System.Collections.Generic;
using Gloobster.Entities;
using Gloobster.Entities.Trip;

namespace Gloobster.Portal.ViewModels
{
    public class ViewModelPlanning : ViewModelBase
    {
        public string InitCurrentLocation { get; set; }

        public CityLocationSE CurrentLocation { get; set; }

        public List<AirportEntity> Airports { get; set; }

        public string AirportsStr
        {
            get
            {
                if (Airports == null)
                {
                    return "N/A";
                }

                if (Airports.Count == 3)
                {
                    return $"{Airports[0].IataFaa}, {Airports[1].IataFaa}, {Airports[2].IataFaa}";
                }
                if (Airports.Count == 2)
                {
                    return $"{Airports[0].IataFaa}, {Airports[1].IataFaa}";
                }
                if (Airports.Count == 1)
                {
                    return Airports[0].IataFaa;
                }
                if (Airports.Count > 3)
                {
                    return $"{Airports[0].IataFaa}, {Airports[1].IataFaa}, {Airports[2].IataFaa},...";
                }

                return "";
            }
        }

        public string CityName
        {
            get
            {
                if (CurrentLocation == null)
                {
                    return "N/A";
                }

                return CurrentLocation.City;
            }
        }

        public string CountryName
        {
            get
            {
                if (CurrentLocation == null)
                {
                    return "N/A";
                }

                return CurrentLocation.CountryCode;
            }
        }

    }

    public class ViewModelSkypickerChat : ViewModelBase
    {
    }
}