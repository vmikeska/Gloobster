using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft;
using System.IO;
using Newtonsoft.Json;
using System.Device.Location;

namespace SpPlacesConverter
{
    public class SplitRecords
    {
        public List<SpRecord> spAirports;
        public List<SpRecord> spCountries;
        public List<SpRecord> spCities;         
    }

    public class Program
    {
        public static void Main(string[] args)
        {
            SplitRecords splitData = FirstStep();

            

            var citiesPath = @"C:\S\DBScripts\CitiesWithAirports.json";
            if (!File.Exists(citiesPath))
            {
                SaveCitiesFirstStep(citiesPath, splitData.spCities);
            }
            
            //UpdateCitiesGid(citiesPath);

            ConvertAirports(citiesPath, splitData.spAirports);
        }

        public static void ConvertAirports(string citiesPath, List<SpRecord> spAirports)
        {
            var citiesText = File.ReadAllText(citiesPath);
            var cities = JsonConvert.DeserializeObject<List<City>>(citiesText);

            var oldAirportsPath = @"C:\S\DBScripts\airports3.json";
            var oldAirportsText = File.ReadAllText(oldAirportsPath);
            var oldAirports = JsonConvert.DeserializeObject<List<OldAirport>>(oldAirportsText);

            var airports = new List<Airport>();
            foreach (SpRecord spAirport in spAirports)
            {
                if (string.IsNullOrEmpty(spAirport.parentId))
                {
                    continue;
                }

                var oldAirport = oldAirports.FirstOrDefault(a => a.IataFaa == spAirport.id);
                bool oldAirFound = oldAirport != null;

                Airport airport = new Airport
                {
                    Name = spAirport.value,
                    Code = spAirport.id,
                    IsValid = true
                };
                
                var idPrms = spAirport.parentId.Split('_');
                if (idPrms.Count() == 2)
                {
                    var cityId = idPrms[0];                    
                    var countryCode = idPrms[1].ToUpper();

                    airport.CountryCode = countryCode;

                    var city = cities.FirstOrDefault(c => c.SpId == cityId && c.CountryCode == countryCode);

                    if (city == null)
                    {
                        city = new City
                        {
                            Name = spAirport.value,
                            CountryCode = countryCode
                        };
                        FixCity(city);

                        if (city.GID == 0)
                        {
                            //we are not interested into this record anymore
                            continue;
                        }

                        if (!cities.Any(c => c.GID == city.GID))
                        {
                            cities.Add(city);
                        }
                    }


                    if (city.GID == 0)
                    {
                        airport.Error = "HasNoGid";
                        airport.IsValid = false;
                    }
                    airport.GID = city.GID;

                    if (oldAirFound)
                    {
                        airport.Coord = oldAirport.Coord;
                        airport.Coord.Lat = Math.Round(airport.Coord.Lat, 3);
                        airport.Coord.Lng = Math.Round(airport.Coord.Lng, 3);

                        var mDistance = GetDistance(airport.Coord, city.Coord);
                        airport.Distance = Math.Round(mDistance/1000, 2);
                    }
                }
                else
                {
                    airport.Error = "HasWrongParentId";
                    airport.IsValid = false;
                }



                airports.Add(airport);
            }

            //resave cities, some of them were added
            var citiesJson = JsonConvert.SerializeObject(cities);
            File.WriteAllText(citiesPath, citiesJson);


            var airportsPath = @"C:\S\DBScripts\newAirports.json";
            var airportsJson = JsonConvert.SerializeObject(airports);
            File.WriteAllText(airportsPath, airportsJson);

        }

        private static double GetDistance(LatLng latLng1, LatLng latLng2)
        {
            var sCoord = new GeoCoordinate(latLng1.Lat, latLng1.Lng);
            var eCoord = new GeoCoordinate(latLng2.Lat, latLng2.Lng);

            double dist = sCoord.GetDistanceTo(eCoord);
            return dist;
        }



        public static SplitRecords FirstStep()
        {
            var path = @"C:\S\DBScripts\SP_airports.json";
            var text = File.ReadAllText(path);

            var spRecords = JsonConvert.DeserializeObject<List<SpRecord>>(text);

            var spAirports = spRecords.Where(r => r.type == 0).ToList();
            var spCountries = spRecords.Where(r => r.type == 1).ToList();
            var spCities = spRecords.Where(r => r.type == 2).ToList();

            return new SplitRecords
            {
                spAirports = spAirports,
                spCities = spCities,
                spCountries = spCountries
            };
        }

        public static void UpdateCitiesGid(string path)
        {
            var text = File.ReadAllText(path);

            var cities = JsonConvert.DeserializeObject<List<City>>(text);
            foreach (City city in cities)
            {
                if (city.GID != 0)
                {
                    continue;                    
                }

                FixCity(city);
            }
            
            var outText = JsonConvert.SerializeObject(cities);
            File.WriteAllText(path, outText);
        }

        private static void FixCity(City city)
        {
            try
            {
                var gnCityResult = GeoNamesService.GetCity(city.Name, city.CountryCode);
                if (gnCityResult != null && gnCityResult.TotalResultsCount > 0)
                {
                    var gnCity = gnCityResult.GeoNames.First();
                    city.GID = gnCity.GeonameId;
                    if (!city.population.HasValue && gnCity.Population > 0)
                    {
                        city.population = gnCity.Population;
                    }

                    if (city.Coord == null)
                    {
                        city.Coord = new LatLng
                        {
                            Lat = gnCity.Latitude,
                            Lng = gnCity.Longitude
                        };
                    }
                }
            }
            catch (Exception exc)
            {

            }
        }

        public static void SaveCitiesFirstStep(string path, List<SpRecord> spCities)
        {
            var cities = new List<City>();

            foreach (var spCity in spCities)
            {
                var city = new City
                {
                    Name = spCity.value,
                    GID = 0,
                    CountryCode = spCity.parentId,
                    SpId = spCity.id
                };

                if (spCity.population.HasValue)
                {
                    spCity.population = spCity.population.Value;
                }

                if (spCity.lat.HasValue && spCity.lng.HasValue)
                {
                    city.Coord = new LatLng
                    {
                        Lat = spCity.lat.Value,
                        Lng = spCity.lng.Value
                    };
                }
                cities.Add(city);
            }

            var citiesJson = JsonConvert.SerializeObject(cities);            
            File.WriteAllText(path, citiesJson);
        }
    }

    public class GeoDistance
    {
        
        //  This routine calculates the distance between two points (given the    
        //  latitude/longitude of those points). It is being used to calculate    
        //  the distance between two locations using GeoDataSource(TM) products   
        //                                                                        
        //  Definitions:                                                          
        //    South latitudes are negative, east longitudes are positive          
        //                                                                        
        //  Passed to function:                                                   
        //    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees) 
        //    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees) 
        //    unit = the unit you desire for results                              
        //           where: 'M' is statute miles (default)                        
        //                  'K' is kilometers                                     
        //                  'N' is nautical miles                                     
      

        private double Distance(LatLng latLng1, LatLng latLng2)
        {
            double theta = latLng1.Lng - latLng2.Lng;
            double dist = Math.Sin(Deg2rad(latLng1.Lat))*Math.Sin(Deg2rad(latLng2.Lat)) +
                          Math.Cos(Deg2rad(latLng1.Lat))*Math.Cos(Deg2rad(latLng2.Lat))*Math.Cos(Deg2rad(theta));
            dist = Math.Acos(dist);
            dist = Rad2deg(dist);
            dist = dist*60*1.1515;
            
            dist = dist*1.609344;
            
            return (dist);
        }
        
        private double Deg2rad(double deg)
        {
            return (deg*Math.PI/180.0);
        }
        
        private double Rad2deg(double rad)
        {
            return (rad/Math.PI*180.0);
        }

        //Console.WriteLine(distance(32.9697, -96.80322, 29.46786, -98.53506, "M"));
        //Console.WriteLine(distance(32.9697, -96.80322, 29.46786, -98.53506, "K"));
        //Console.WriteLine(distance(32.9697, -96.80322, 29.46786, -98.53506, "N"));
    }

    public class OldAirport
    {
        public string Name { get; set; }
        public string City { get; set; }        
        public LatLng Coord { get; set; }
        public int GeoNamesId { get; set; }
        public string IataFaa { get; set; }
        public string Icao { get; set; }
        public int Alt { get; set; }
        public int IncomingFlights { get; set; }        
    }

    public class Airport
    {
        public string Name { get; set; }
        public string CountryCode { get; set; }
        public int GID { get; set; }
        public LatLng Coord { get; set; }
        public double Distance { get; set; }
        public string Code { get; set; }
        public bool IsValid { get; set; }
        public string Error { get; set; }
    }

    public class City
    {           
        public string Name { get; set; }
        public string CountryCode { get; set; }
        public LatLng Coord { get; set; }
        public int GID { get; set; }
        public int? population { get; set; }
        public string SpId { get; set; }
    }



    public class SpRecord
    {
        public int? zoomLevelThreshold { get; set; }
        public int? numberOfAirports { get; set; }
        public int? sp_score { get; set; }
        public string value { get; set; }
        public int? rank { get; set; }
        public string parentId { get; set; }
        public double? lat { get; set; }
        public double? lng { get; set; }
        public int type { get; set; }
        public string id { get; set; }
        public int? population { get; set; }
    }

    public class LatLng
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }

}
