
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using CordinatestConvert;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CoordinatesConvertor
{

    public class Utils
    {
        public static double[][] WriteDataArray(JToken[] input)
        {
            var outCoordinatesList = new List<double[]>();
            foreach (var coordinate in input)
            {
                var cor1 = double.Parse(coordinate[1].ToString());
                var cor2 = double.Parse(coordinate[0].ToString());

                cor1 = Math.Round(cor1, 2);
                cor2 = Math.Round(cor2, 2);

                outCoordinatesList.Add(new[] { cor1, cor2 });
            }

            return outCoordinatesList.ToArray();
        }
    }


    public class Program
    {
        

        static void Mainxxx(string[] args)
        {
	        var countryService = new CountryService();

			var inputDir = @"C:\S\world.geo.json\countries";
            var outputDir = @"C:\S\world.geo.json\countriesReverse";

            if (!Directory.Exists(outputDir))
            {
                Directory.CreateDirectory(outputDir);
            }

            string[] inputFiles = System.IO.Directory.GetFiles(inputDir);

            var outputCountries = new List<Country>();
            var logs = new List<string>();
            var types = new List<string>();
            foreach (string inputFileName in inputFiles)
            {
                string countryId = "";
                try
                {
                    string fileText;
                    using (var inputFile = File.OpenText(inputFileName))
                    {
                        fileText = inputFile.ReadToEnd();
                    }

                    JObject jsonObj = JObject.Parse(fileText);
                    var features = jsonObj.GetValue("features");
                    var feature = features.First;

	                try
	                {
						//countryId = feature["id"].ToString();						
						var fileName = Path.GetFileName(inputFileName);
						var fileNamePrms = fileName.Split('.');
						countryId = fileNamePrms[0];
					}
	                catch
	                {
						logs.Add(inputFileName);
						continue;		                
	                }

	                var geometry = feature["geometry"];
                    var geometryType = geometry["type"].ToString();

                    types.Add(geometryType);


                    JToken coordinates = geometry["coordinates"];
                    JToken coordinatesResult = coordinates;


					//var country = new Country
					//{
					//    name = countryId
					//};

	                var cntry = countryService.GetCountryByCountryCode3(countryId);

					var country = new Country
					{
						name = cntry.CountryCode
					};
					
					if (geometryType == "MultiPolygon")
                    {
                        //string test = coordinatesResult.ToString();
                        var temp = new List<double[][]>();
                        foreach (var subSet1 in coordinatesResult.ToArray())
                        {
                            JToken subSet2 = subSet1.First;
                          

                            var single = Utils.WriteDataArray(subSet2.ToArray());
                            temp.Add(single);
                        }
                        country.coordinates = temp.ToArray();
                    }

                    if (geometryType == "Polygon")
                    {
                        var items = coordinatesResult.First.ToArray();

                        var single = Utils.WriteDataArray(items);
                        country.coordinates = new[] { single };
                    }
                    outputCountries.Add(country);

                }
                catch (Exception exception)
                {
                    logs.Add(countryId);
                }
            }

            string json = JsonConvert.SerializeObject(outputCountries.ToArray());

        }
    }
}



////{
////	"type":"FeatureCollection",
////"features":[
////	{
////		"type":"Feature",
////		"id":"CZE",
////		"properties":
////		{
////			"name":"Czech Republic"
////		},
////		"geometry":
////		{
////			"type":"Polygon",
////			"coordinates":[[[16.960288,48.596982],[16.499283,48.785808],]]
////		}}]
////}