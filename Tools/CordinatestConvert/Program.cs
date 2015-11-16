
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CoordinatesConvertor
{

    public class Country
    {
        public string name;
        public float[][][] coordinates;
    }

    public class Program
    {
        public static float[][] WriteDataArray(JToken[] input)
        {
            var outCoordinatesList = new List<float[]>();
            foreach (var coordinate in input)
            {
                var cor1 = float.Parse(coordinate[1].ToString());
                var cor2 = float.Parse(coordinate[0].ToString());

                outCoordinatesList.Add(new[] { cor1, cor2 });
            }

            return outCoordinatesList.ToArray();
        }

        static void Main(string[] args)
        {
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
		                countryId = feature["id"].ToString();
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

                    //if (coordinates.Length == 1)
                    //{
                    //	coordinatesResult = coordinates[0].ToArray();
                    // }

                    var country = new Country
                    {
                        name = countryId
                    };


                    if (geometryType == "MultiPolygon")
                    {
                        //string test = coordinatesResult.ToString();
                        var temp = new List<float[][]>();
                        foreach (var subSet1 in coordinatesResult.ToArray())
                        {
                            JToken subSet2 = subSet1.First;
                            //if (subField.Count() == 1)
                            //{
                            //	field = subField.First();
                            //}

                            var single = WriteDataArray(subSet2.ToArray());
                            temp.Add(single);
                        }
                        country.coordinates = temp.ToArray();
                    }

                    //float validFloat;
                    //bool isValidFloat = float.TryParse(coordinatesResult.First().First().ToString(), out validFloat);

                    //if (!isValidFloat)
                    //{
                    //	var temp = new List<float[][]>();

                    //	foreach (var subField in coordinatesResult)
                    //	{
                    //		JToken field = subField;
                    //		if (subField.Count() == 1)
                    //		{
                    //			field = subField.First();
                    //		}

                    //		var single = WriteDataArray(field.ToArray());
                    //		temp.Add(single);
                    //	}
                    //	country.coordinates = temp.ToArray();
                    //}
                    //else
                    if (geometryType == "Polygon")
                    {
                        var items = coordinatesResult.First.ToArray();

                        var single = WriteDataArray(items);
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


public class CountryPart
{
    public string name;
    public float[][][] coordinates;
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