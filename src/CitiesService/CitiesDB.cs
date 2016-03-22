using System.Collections.Generic;
using System.Linq;
using Gloobster.Database;
using Gloobster.DomainObjects;
using Gloobster.Entities;
using Gloobster.Mappers;

namespace Gloobster.CitiesService
{
	public class CitiesDB : ICitiesDB
	{
		public const string ConnectionString = "mongodb://CitiesConnector:Gloobster007@ds052968.mongolab.com:52968/CitiesDB";
		public const string DbName = "CitiesDB";

		public DbOperations DB { get; set; }
		public Dictionary<int, CityDO> CitiesIdDictionary = new Dictionary<int, CityDO>();
		public Dictionary<char, List<Names>> CharDict = new Dictionary<char, List<Names>>();

		public CitiesDB()
		{
			DB = new DbOperations(ConnectionString, DbName);			
		}

		private void AddNameToDict(string name, CityDO city)
		{

			if (name == string.Empty)
			{
				return;
			}

			string lowName = name.ToLower();
			if (lowName == string.Empty)
			{
				return;
			}
			
			string lowUnicodeName = lowName.Unidecode();
			if (lowUnicodeName == string.Empty)
			{
				return;
			}
			
			char firstLetter = lowUnicodeName[0];

			List<Names> dict;
			if (CharDict.ContainsKey(firstLetter))
			{
				dict = CharDict[firstLetter];
			}
			else
			{
				dict = new List<Names>();
				CharDict.Add(firstLetter, dict);
			}

			var record = new Names
			{
				SearchForm = lowUnicodeName,
				City = city
			};
			dict.Add(record);
		}

		public void InitializeData()
		{
			var col = DB.C<CityEntity>();
			
			var allCities = col.ToList();

			foreach (var city in allCities)
			{
				if (city.GID != 0)
				{
					CitiesIdDictionary.Add(city.GID, city.ToDO());
				}
			}

			foreach (var c in CitiesIdDictionary)
			{
				var city = c.Value;
				
				AddNameToDict(city.Name, city);
				
				var alterNames = city.AlternateNames.Split(',');
				foreach (string alternate in alterNames)
				{
					AddNameToDict(alternate, city);
				}

			}


			//order at the end
		    Dictionary<char, List<Names>> tempDict = new Dictionary<char, List<Names>>();
			foreach (KeyValuePair<char, List<Names>> group in CharDict)
			{
				tempDict.Add(group.Key, group.Value.OrderByDescending(i => i.City.Population).ToList());
			}
			CharDict = tempDict;
		}

		
		public CityDO GetCityById(int id)
		{			
			if (!CitiesIdDictionary.ContainsKey(id))
			{
				return null;
			}

			var cityDO = CitiesIdDictionary[id];			
			return cityDO;
		}

        public List<CityDO> FindCity(string name, string countryCode, int maxRows)
		{
			var cc = countryCode.ToLower();

			var nameLower = name.ToLower().Unidecode();
			char firstLetter = nameLower[0];

			if (!CharDict.ContainsKey(firstLetter))
			{
				return null;
			}

			var list = CharDict[firstLetter];

			var results = new List<CityDO>();

			foreach (Names item in list)
			{
				if (results.Count == maxRows)
				{
					return results;
				}
				
				if (item.SearchForm == nameLower && item.City.CountryCode.ToLower() == cc)
				{
					bool added = results.Contains(item.City);
					if (!added)
					{
						results.Add(item.City);
					}
				}
			}

			return results;
		}

	    public List<CityDO> QueryCities(string query, int maxRows)
		{
			var queryLower = query.ToLower().Unidecode();
			char firstLetter = queryLower[0];

			if (!CharDict.ContainsKey(firstLetter))
			{
				return null;
			}

			var list = CharDict[firstLetter];

			var results = new List<CityDO>();

			foreach (Names item in list)
			{
				if (results.Count == maxRows)
				{
					return results;
				}
				
				if (item.SearchForm.StartsWith(queryLower))
				{
					bool added = results.Contains(item.City);
					if (!added)
					{
						results.Add(item.City);
					}
				}
			}
			
			return results;
		}
		

	}


	public interface ICitiesDB
	{
		void InitializeData();
		CityDO GetCityById(int id);
		List<CityDO> QueryCities(string query, int maxRows);
		List<CityDO> FindCity(string name, string countryCode, int maxRows);	    
	}

	public class Names
	{		
		public string SearchForm;
		public CityDO City;
	}
}
