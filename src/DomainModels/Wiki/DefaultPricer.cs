using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Linq;

namespace Gloobster.DomainModels.Wiki
{
    public static class DefaultPricer
    {
        public static BeerPrices BeerPrices;
        public static List<Prices> Prices;

        public static void Parse(string beerPricesJson, string pricesJson)
        {
            BeerPrices = ParseBeerPrices(beerPricesJson);
            Prices = ParsePrices(pricesJson);
        }

        public static BeerPrices ParseBeerPrices(string jsonText)
        {
            var rough = JsonConvert.DeserializeObject<BeerPricesRough>(jsonText);

            var beerPrices = new BeerPrices
            {
                Items = new Dictionary<string, decimal>()
            };

            foreach (var item in rough.beerPrices)
            {
                beerPrices.Items.Add(item[0].ToString(), decimal.Parse(item[1].ToString()));
            }

            return beerPrices;
        }

        public static List<Prices> ParsePrices(string jsonText)
        {
            var rough = JsonConvert.DeserializeObject<GroupRough>(jsonText);

            var groups = new List<Prices>();

            foreach (var roughGroup in rough.groups)
            {
                var group = new Prices
                {
                    Countries = roughGroup.countries,
                    Region = roughGroup.region,                    
                    Items = new Dictionary<string, decimal>(),
                    NightlifeItems = new Dictionary<string, PriceTrio>()
                };

                foreach (var item in roughGroup.items)
                {
                    group.Items.Add(item[0].ToString(), decimal.Parse(item[1].ToString()));
                }

                foreach (var item in roughGroup.night)
                {
                    group.NightlifeItems.Add(item[0].ToString(), new PriceTrio
                    {
                        Pub = decimal.Parse(item[1].ToString()),
                        Bar = decimal.Parse(item[2].ToString()),
                        Club = decimal.Parse(item[3].ToString())
                    });                    
                }

                groups.Add(group);
            }

            return groups;
        }


        public static decimal GetDefaultPrice(string countryCode, string type, string subCategory = null)
        {
            decimal price = 1;

            if (type == "Beer")
            {
                if (BeerPrices.Items.ContainsKey(countryCode))
                {
                    price = BeerPrices.Items[countryCode];

                    if (subCategory == "Bar")
                    {
                        price = price * 1.1m;
                    }
                    if (subCategory == "Club")
                    {
                        price = price * 1.5m;
                    }
                }
            }
            else
            {
                Prices economicGroup = Prices.FirstOrDefault(p => p.Countries.Contains(countryCode));
                if (economicGroup == null)
                {                    
                    Console.WriteLine("MissingCountry: " + countryCode);
                    return price;                    
                }

                bool isNightLifePrice = !string.IsNullOrEmpty(subCategory);
                if (isNightLifePrice)
                {
                    var item = economicGroup.NightlifeItems[type];
                    if (subCategory == "Pub")
                    {
                        return item.Pub;
                    }
                    if (subCategory == "Bar")
                    {
                        return item.Bar;
                    }
                    if (subCategory == "Club")
                    {
                        return item.Club;
                    }
                }
                else
                {
                    if (economicGroup.Items.ContainsKey(type))
                    {
                        price = economicGroup.Items[type];
                    }
                }
            }
            
            return price;
        }
    }


    public class BeerPrices
    {
        public Dictionary<string, decimal> Items;
    }

    public class Prices
    {
        public string Region { get; set; }
        public List<string> Countries { get; set; }

        public Dictionary<string, decimal> Items { get; set; } 

        public Dictionary<string, PriceTrio> NightlifeItems { get; set; }
    }

    public class PriceTrio
    {        
        public decimal Bar { get; set; }
        public decimal Pub { get; set; }
        public decimal Club { get; set; }
    }


    //-----

    public class PriceRough
    {
        public string region { get; set; }
        public List<string> countries { get; set; }
        public List<List<object>> items { get; set; }
        public List<List<object>> night { get; set; }
    }

    public class GroupRough
    {
        public List<PriceRough> groups { get; set; }
    }


    public class BeerPricesRough
    {
        public List<List<object>> beerPrices { get; set; }
    }

    
}