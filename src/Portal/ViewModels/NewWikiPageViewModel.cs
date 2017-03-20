using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    public abstract class NewWikiModelBase : ViewModelBase
    {
        public List<SectionSE> Sections { get; set; }
        public string ArticleId { get; set; }
        public List<ArticleDataSE> Data { get; set; }
        public string CountryCode { get; set; }

        public List<ObjectId> Dos { get; set; }
        public List<ObjectId> Donts { get; set; }

        public WikiTextsEntity Texts { get; set; }

        public List<WikiPageBlock> BigBlocks { get; set; }

        public bool IsAdmin { get; set; }

        public List<InfoItemVM> _info;

        public List<InfoItemVM> Info
        {
            get
            {
                if (_info == null)
                {
                    _info = GetInfoItems();
                }

                return _info;
            }
        }

        public void LoadSections()
        {
            BigBlocks = new List<WikiPageBlock>();

            foreach (var section in Sections)
            {
                var text = Texts.Texts.FirstOrDefault(t => t.Section_id == section.id);

                var block = new WikiPageBlock
                {
                    Base = this,
                    Text = text.Text,                    
                    Liked = WasLiked(text),
                    SectionType = section.Type,
                    Type = GetSectionType(section.Type),
                    Rating = text.Rating,
                    SectionId = section.id.ToString(),
                    PhotoId = "todo"
                };

                if (section.Type == "Base")
                {
                    block.Title = Texts.Title;
                }
                else
                {
                    block.Title = W(section.Type);
                }

                BigBlocks.Add(block);
            }

            var dosDontsBlock = new WikiPageBlock
            {
                Base = this,
                Data = DoDonts(),
                Type = SectionType.DosDonts
            };
            BigBlocks.Add(dosDontsBlock);

            OrderBlocks();
        }

        protected virtual List<string> OrderPreference { get; }

        private void OrderBlocks()
        {
            var sortedBlocks = new List<WikiPageBlock>();

            foreach (var pref in OrderPreference)
            {
                WikiPageBlock block = BigBlocks.FirstOrDefault(b => b.SectionType == pref); ;
                
                if (block != null)
                {
                    sortedBlocks.Add(block);
                }
            }

            var diff = BigBlocks.Except(sortedBlocks).ToList();

            if (diff.Any())
            {
                sortedBlocks.AddRange(diff);
            }

            BigBlocks = sortedBlocks;
        }

        private SectionType GetSectionType(string category)
        {
            if (category == "Base")
            {
                return SectionType.Header;
            }

            
            return SectionType.Standard;            
        }

        public SectionSE FindSectionByType(string type)
        {
            var sect = Sections.FirstOrDefault(s => s.Type == type);
            if (sect == null)
            {
                //something
            }
            return sect;
        }

        public T GetSectionText<T>(string type) where T : SectionTextsSE
        {
            var section = FindSectionByType(type);
            var text = GetTexts<SectionTextsSE>(section.id);

            return text as T;
        }



        public T GetTexts<T>(ObjectId id) where T : SectionTextsSE
        {
            var text = Texts.Texts.FirstOrDefault(t => t.Section_id == id);
            if (text == null)
            {
                //something
            }

            return text as T;
        }

        private bool? WasLiked(SectionTextsSE text)
        {
            if (string.IsNullOrEmpty(UserId))
            {
                return null;
            }

            var userIdObj = new ObjectId(UserId);

            bool liked = text.Likes.Contains(userIdObj);
            bool disliked = text.Dislikes.Contains(userIdObj);

            bool? wasLiked = null;
            if (liked)
            {
                wasLiked = true;
            }
            if (disliked)
            {
                wasLiked = false;
            }

            return wasLiked;
        }

        public List<InfoItemVM> GetInfoItems()
        {
            var items = new List<InfoItemVM>();

            var lists = DB.List<WikiListValuesEntity>();

            foreach (ArticleDataSE item in Data)
            {
                var outItem = new InfoItemVM
                {
                    Id = item.id.ToString(),
                    Name = item.Name,
                    Show = true,
                    ListCategory = item.ListCategory
                };
                items.Add(outItem);

                bool isList = item.Values != null;
                bool isListValue = !string.IsNullOrEmpty(item.ListCategory);

                WikiListValuesEntity list = null;
                if (isListValue)
                {
                    list = lists.FirstOrDefault(l => l.ListCategory == item.ListCategory);
                }

                if (item.DataType == ArticleDataType.Int)
                {
                    if (string.IsNullOrEmpty(item.Value))
                    {
                        outItem.Show = false;
                    }
                    else
                    {
                        if (isListValue)
                        {
                            var listItem = list.Items.FirstOrDefault(i => i.Id == item.Value);

                            //don't delete, translation will be used later
                            //if (listItem.Translate)
                            //{
                            //    outItem.Value = W(listItem.Name);
                            //}
                            //else
                            //{
                            outItem.Value = listItem.Name;
                            //}

                        }
                        else
                        {
                            outItem.Value = int.Parse(item.Value).ToString("N0", CultureInfo.InvariantCulture);
                        }
                    }
                }

                if (item.DataType == ArticleDataType.String)
                {
                    if (isList)
                    {
                        var vals = new List<string>();
                        foreach (string val in item.Values)
                        {
                            var listItem = list.Items.FirstOrDefault(i => i.Id == val);
                            if (listItem != null)
                            {
                                //don't delete, translation will be used later
                                //if (listItem.Translate)
                                //{
                                //    var txt = W(listItem.Name);
                                //    vals.Add(txt);
                                //}
                                //else
                                //{
                                vals.Add(listItem.Name);
                                //}                                
                            }
                        }
                        outItem.Value = string.Join(",", vals);
                    }
                    else
                    {
                        outItem.Value = item.Value;
                    }
                }

                if (item.DataType == ArticleDataType.Decimal)
                {
                    if (string.IsNullOrEmpty(item.Value))
                    {
                        outItem.Show = false;
                    }
                    else
                    {
                        outItem.Value = decimal.Parse(item.Value).ToString("N2", CultureInfo.InvariantCulture);
                    }
                }

                if (item.DataType == ArticleDataType.Bool)
                {
                    if (string.IsNullOrEmpty(item.Value))
                    {
                        outItem.Show = false;
                    }
                    else
                    {
                        var value = bool.Parse(item.Value);
                        var code = value ? "Yes" : "No";

                        outItem.Value = code;
                    }
                }


            }

            return items;
        }

        public InfoItemVM InfoByName(string name)
        {
            var info = Info.FirstOrDefault(i => i.Name == name);
            info.TranslatedName = W(info.Name);

            return info;
        }

        public virtual List<Breadcrumb> GetBreadcrumb()
        {
            return new List<Breadcrumb>
            {
                new Breadcrumb
                {
                    Id = ArticleId,
                    Name = "Wiki",
                    Link = "/wiki"
                }
            };
        }

        public virtual Table1ViewModel GetPricesByCategory(string category, string subCategory = null)
        {            
            return null;
        }

        private DoDontsVM DoDonts()
        {
            var model = new DoDontsVM
            {
                B = this,
                Donts = Donts.Select(i =>
                {
                    var item = GetDoDontItem(i);
                    return new DdVM
                    {
                        Text = item.Text,
                        Id = item.Section_id.ToString(),
                        Liked = WasLiked(item),
                        B = this
                    };
                }).ToList(),
                Dos = Dos.Select(i =>
                {
                    var item = GetDoDontItem(i);
                    return new DdVM
                    {
                        Text = item.Text,
                        Id = item.Section_id.ToString(),
                        Liked = WasLiked(item),
                        B = this
                    };
                }).ToList()

            };
            return model;
        }


        public SectionTextsSE GetDoDontItem(ObjectId id)
        {
            var item = Texts.Texts.FirstOrDefault(t => t.Section_id == id);

            return item;
        }

        //public string TitleLink { get; set; }

        //public virtual List<RelatedLink> GetRelatedLinks()
        //{
        //    return new List<RelatedLink>();
        //}


        //public abstract List<ObjectId> Dos { get; }
        //public abstract List<ObjectId> Donts { get; }



        //public List<LangVersionVM> LangVersions { get; set; }

        //public string GetLangName(string langCode)
        //{
        //    if (langCode == "en")
        //    {
        //        return "English";
        //    }

        //    if (langCode == "de")
        //    {
        //        return "Deutsch";
        //    }

        //    return null;
        //}

        //unused, but dont delete
        //public string GetNameFromContinent(Continent c)
        //{
        //    switch (c)
        //    {
        //        case Continent.Africa:
        //            return "Africa";
        //        case Continent.Europe:
        //            return "Europe";
        //        case Continent.Australia:
        //            return "Australia";
        //        case Continent.Antarctica:
        //            return "Antarctica";
        //        case Continent.SouthAmerica:
        //            return "South America";
        //        case Continent.NorthAmerica:
        //            return "North America";
        //        case Continent.Asia:
        //            return "Asia";
        //    }

        //    return "Default";
        //}

    }

    public class NewWikiCountryViewModel : NewWikiModelBase
    {
        protected override List<string> OrderPreference => new List<string>
        {
            "Base",
            "AboutPeople",
            "Accommodation",
            "Languages",
            "Safety",
            "Transport",
            
            "Restaurant",
            "Alcohol",
            "NightLife",
            "Tipping",

            "Marihuana",
            "Gay",

            "Hitchhiking",

            "Internet",
            "SimCards",
            
            //"NightlifePrices",
        };

        public override Table1ViewModel GetPricesByCategory(string category, string subCategory = null)
        {
            List<PriceItemVM> categoryPrices = AggPrices.Where(p => p.Category == category && (subCategory == null || p.SubCategory == subCategory)).ToList();

            var catPrices = categoryPrices.Select(cp => new TableItemVM
            {
                Name = cp.Type,
                Price1 = cp.Price                
            }).ToList();

            var res = new Table1ViewModel
            {
                Type = Texts.Type,
                B = this,
                ShowButtons = false,
                TableItems = catPrices,

                Title = category, //todo: WORD
                SubTitle = subCategory //todo: WORD
            };

            return res;
        }

        private List<PriceItemVM> _aggPrices;
        public List<PriceItemVM> AggPrices => _aggPrices ?? (_aggPrices = GetAggregatedPrices());

        public override List<Breadcrumb> GetBreadcrumb()
        {
            var bc = base.GetBreadcrumb();

            //var contName = GetNameFromContinent(Article.Continent);
            //continent
            //bc.Add(
            //    new Breadcrumb
            //    {
            //        Id = ((int)Article.Continent).ToString(),
            //        Name = contName,
            //        Link = $"/wiki/{Texts.Language}/{contName}"
            //    }
            //);

            //country
            bc.Add(
                new Breadcrumb
                {
                    Id = ArticleId,
                    Name = Texts.Title,
                    Link = $"/wiki/{Texts.Language}/{Texts.LinkName}"
                }
            );

            return bc;
        }

        private List<PriceItemVM> GetAggregatedPrices()
        {
            var allCities = DB.List<WikiCityEntity>(c => c.CountryCode == CountryCode);
            var allPrices = allCities.SelectMany(p => p.Prices).ToList();

            var filteredPrices = FilterSetUnsetPrices(allPrices);

            var groupedItems = filteredPrices
                .GroupBy(p => new { p.Type, p.Category, p.SubCategory })
                .ToList();

            var aggPrices = groupedItems.Select(g =>
            {
                var items = g.ToList();
                var fi = items.First();

                return new PriceItemVM
                {
                    Category = fi.Category,
                    Type = fi.Type,
                    SubCategory = fi.SubCategory,
                    Price = items.Average(i => i.Price.CurrentPrice)
                };
            })
            .ToList();

            return aggPrices;
        }

        private List<PriceItemSE> FilterSetUnsetPrices(List<PriceItemSE> prices)
        {
            var groupedItems = prices
                .GroupBy(p => new { p.Type, p.Category, p.SubCategory })
                .ToList();

            var outPrices = new List<PriceItemSE>();

            foreach (var group in groupedItems)
            {
                var items = group.ToList();

                //has initialized price, this price is for us most accurate, so take just initialized ones
                var initPrices = items.Where(i => i.Price.Initialized).ToList();
                if (initPrices.Any())
                {
                    outPrices.AddRange(initPrices);
                }
                else
                {
                    //if has any rated prices, take just rated prices, these are second most trustable for us
                    var ratedPrices = items.Where(i => i.Price.Minus.Any() || i.Price.Plus.Any()).ToList();
                    if (ratedPrices.Any())
                    {
                        outPrices.AddRange(ratedPrices);
                    }
                    else
                    {
                        //using just default values (takes just first, coz default should be same for entire country)
                        outPrices.Add(items.First());
                    }
                }
            }

            return outPrices;
        }
    }



    public class NewWikiCityViewModel : NewWikiModelBase
    {
        public List<PriceItemSE> Prices { get; set; }

        protected override List<string> OrderPreference => new List<string>
        {
            "Base",
            "AboutPeople",
            "Accommodation",
            "Safety",
            "BarDistricts",
            "Transport",
            "NightLife",
            "Restaurant",
            "Tipping",
            "DosDonts",

            "FavoriteSites",
            
            "MuseumsAndTheater",
            "Sport"
            

            //NightlifePrices
            //Surfing
        };

        public override Table1ViewModel GetPricesByCategory(string category, string subCategory = null)
        {
            List<PriceItemSE> categoryPrices = Prices.Where(p => p.Category == category && (subCategory == null || p.SubCategory == subCategory )).ToList();

            List<TableItemVM> prices = categoryPrices.Select(ConvertTableItem).ToList();

            var res = new Table1ViewModel {
                Type = Texts.Type,
                B = this,
                ShowButtons = true,
                TableItems = prices,

                Title = category, //todo: WORD
                SubTitle = subCategory //todo: WORD
            };

            return res;
        }

        private TableItemVM ConvertTableItem(PriceItemSE priceItem)
        {
            var res = new TableItemVM
            {
                Id1 = priceItem.id.ToString(),
                Name = priceItem.Type,
                Price1 = priceItem.Price.CurrentPrice,
                Liked1 = WasLikedPrice(priceItem)
            };
            return res;
        }

        private bool? WasLikedPrice(PriceItemSE price)
        {
            if (string.IsNullOrEmpty(UserId))
            {
                return null;
            }

            var userIdObj = new ObjectId(UserId);

            bool liked = price.Price.Plus.Contains(userIdObj);
            bool disliked = price.Price.Minus.Contains(userIdObj);

            bool? wasLiked = null;
            if (liked)
            {
                wasLiked = true;
            }
            if (disliked)
            {
                wasLiked = false;
            }

            return wasLiked;
        }

        public override List<Breadcrumb> GetBreadcrumb()
        {
            var bc = base.GetBreadcrumb();

            var countryArticle = DB.FOD<WikiCountryEntity>(i => i.CountryCode == CountryCode);
            var countryTexts = DB.FOD<WikiTextsEntity>(i => i.Article_id == countryArticle.id && i.Language == Texts.Language);


            //var contName = GetNameFromContinent(countryArticle.Continent);
            //continent
            //bc.Add(                
            //    new Breadcrumb
            //    {
            //        Id = ((int)countryArticle.Continent).ToString(),
            //        Name = contName,
            //        Link = $"/wiki/{Texts.Language}/{contName}"
            //    }
            //);

            //country
            bc.Add(
                new Breadcrumb
                {
                    Id = countryArticle.id.ToString(),
                    Name = countryTexts.Title,
                    Link = $"/wiki/{Texts.Language}/{countryTexts.LinkName}"
                }
            );

            //city
            bc.Add(
                new Breadcrumb
                {
                    Id = ArticleId,
                    Name = Texts.Title,
                    Link = $"/wiki/{Texts.Language}/{Texts.LinkName}"
                }
            );

            return bc;
        }        
    }

    public class Table1ViewModel
    {
        public string Title { get; set; }
        public string SubTitle { get; set; }
        
        public List<TableItemVM> TableItems { get; set; }
        public NewWikiModelBase B { get; set; }
        public ArticleType Type { get; set; }
        public bool ShowButtons { get; set; }
    }

    public enum SectionType { Header, Standard, DosDonts }

    public class WikiPageBlock
    {
        public NewWikiModelBase Base { get; set; }
        
        public SectionType Type { get; set; }
        public string SectionType { get; set; }

        public int Rating { get; set; }
        public bool? Liked { get; set; }

        public string Title { get; set; }
        public string Text { get; set; }

        public string PhotoId { get; set; }
 
        public string SectionId { get; set; }
        
        public object Data { get; set; }
    }
}