
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using CordinatestConvert;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace CoordinatesConvertor
{
    public class ProgramXX
    {
        //public static float Convert(string origNum)
        //{
        //    float numParsed1 = float.Parse(origNum);
        //    string cut = numParsed1.ToString("0.000");
        //    float numParsed2 = float.Parse(cut);
        //    return numParsed2;
        //}


        static void Main(string[] args)
        {
	        var countryService = new CountryService();

			var inputDir = @"C:\S\world.geo.json\countries\USA";
            var outputDir = @"C:\S\world.geo.json\";

            if (!Directory.Exists(outputDir))
            {
                Directory.CreateDirectory(outputDir);
            }

            string[] inputFiles = Directory.GetFiles(inputDir);

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


					
					var country = new Country
					{
						name = countryId
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

            var outStr = "[";
            foreach (var c in outputCountries)
            {
                var str = JsonConvert.SerializeObject(c) ;
                outStr += str + "," + Environment.NewLine;
            }
            var final = outStr + "]";
            //File.WriteAllText(outputDir + "build.json", final); 

            //string json = JsonConvert.SerializeObject(outputCountries.ToArray());

        }
    }
}