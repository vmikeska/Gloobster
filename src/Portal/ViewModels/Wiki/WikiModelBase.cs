using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using Gloobster.Enums;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    public abstract class WikiModelBase : ViewModelBase
    {
        public string TitleLink { get; set; }

        public List<WikiPhotoSE> Photos { get; set; }

        public List<SectionSE> Sections { get; set; }
        public string ArticleId { get; set; }
        public List<ArticleDataSE> Data { get; set; }
        public string CountryCode { get; set; }

        public List<LinkObjectSE> PlacesLinks { get; set; }

        public List<ObjectId> Dos { get; set; }
        public List<ObjectId> Donts { get; set; }

        public WikiTextsEntity Texts { get; set; }

        public List<WikiPageBlock> BigBlocks = new List<WikiPageBlock>();

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

        public int PhotoGID { get; set; }

        public void LoadSections()
        {
            foreach (var section in Sections)
            {
                var text = Texts.Texts.FirstOrDefault(t => t.Section_id == section.id);

                bool isEmpty = false;

                if (text != null)
                {
                    isEmpty = string.IsNullOrEmpty(text.Text) || text.Text.ToLower() == "no content";
                }

                var block = new WikiPageBlock
                {
                    Base = this,
                    Text = text.Text,
                    Liked = WasLiked(text),
                    SectionType = section.Type,
                    Type = GetSectionType(section.Type),
                    Rating = text.Rating,
                    SectionId = section.id.ToString(),
                    ArticleId = ArticleId,
                    IsEmpty = isEmpty,
                    PhotoId = null
                };

                var sectionPhoto = Photos.FirstOrDefault(p => p.Section_id == section.id);
                bool sectionHasPhoto = sectionPhoto != null;
                if (sectionHasPhoto)
                {
                    block.PhotoId = sectionPhoto.id.ToString();
                }

                if (section.Type == "Base")
                {
                    block.Title = Texts.Title;
                }
                else
                {
                    block.Title = W(section.Type);
                }

                if (section.Type == "BarDistricts")
                {
                    var links = GetLinksBlockByCategory("BarDistricts");
                    block = new WikiPageBlock
                    {
                        Base = this,
                        Data = links,
                        Type = SectionType.Links,
                        Liked = WasLiked(text),
                        SectionType = section.Type,
                        Rating = text.Rating,
                        SectionId = section.id.ToString(),
                        ArticleId = ArticleId,
                        IsEmpty = !links.Any()
                    };
                }

                if (section.Type == "FavoriteSites")
                {
                    var links = GetLinksBlockByCategory("FavoriteSites");
                    block = new WikiPageBlock
                    {
                        Base = this,
                        Data = links,
                        Type = SectionType.Links,
                        Liked = WasLiked(text),
                        SectionType = section.Type,
                        Rating = text.Rating,
                        SectionId = section.id.ToString(),
                        ArticleId = ArticleId,
                        IsEmpty = !links.Any()
                    };
                }

                if (section.Type == "DosDonts")
                {
                    var data = DoDonts();

                    block = new WikiPageBlock
                    {
                        Base = this,
                        Data = data,
                        Type = SectionType.DosDonts,
                        Liked = WasLiked(text),
                        SectionType = section.Type,
                        Rating = text.Rating,
                        SectionId = section.id.ToString(),
                        ArticleId = ArticleId,
                        IsEmpty = !data.Dos.Any() && !data.Donts.Any()
                    };
                }

                if (section.Type == "About")
                {
                    block = new WikiPageBlock
                    {
                        Base = this,
                        Type = SectionType.LayoutCont,
                        SectionType = "About",
                        IsEmpty = false,
                        SectionId = section.id.ToString(),
                        ArticleId = ArticleId
                    };
                }

                if (section.Type == "NightLifePrices")
                {
                    block = new WikiPageBlock
                    {
                        Base = this,
                        Type = SectionType.LayoutCont,
                        SectionType = "NightLifePrices",
                        IsEmpty = false,
                        SectionId = section.id.ToString(),
                        ArticleId = ArticleId
                    };
                }

                if (section.Type == "OtherPrices")
                {
                    block = new WikiPageBlock
                    {
                        Base = this,
                        Type = SectionType.LayoutCont,
                        SectionType = "OtherPrices",
                        IsEmpty = false,
                        SectionId = section.id.ToString(),
                        ArticleId = ArticleId
                    };
                }

                if (section.Type == "Photos")
                {
                    block = new WikiPageBlock
                    {
                        Base = this,
                        Type = SectionType.LayoutCont,
                        SectionType = "Photos",
                        IsEmpty = false,
                        SectionId = section.id.ToString(),
                        ArticleId = ArticleId
                    };
                }

                BigBlocks.Add(block);
            }

            TempFixBlocks();


            OrderBlocks();            
        }

        private void TempFixBlocks()
        {
            if (Texts.Type == ArticleType.City)
            {

                if (BigBlocks.FirstOrDefault(f => f.SectionType == "BarDistricts") == null)
                {
                    var links = GetLinksBlockByCategory("BarDistricts");
                    var block1 = new WikiPageBlock
                    {
                        Base = this,
                        Data = links,
                        Type = SectionType.Links,
                        ArticleId = ArticleId,
                        IsEmpty = !links.Any()
                    };

                    BigBlocks.Add(block1);
                }

                if (BigBlocks.FirstOrDefault(f => f.SectionType == "FavoriteSites") == null)
                {
                    var links = GetLinksBlockByCategory("FavoriteSites");
                    var block1 = new WikiPageBlock
                    {
                        Base = this,
                        Data = links,
                        Type = SectionType.Links,
                        ArticleId = ArticleId,
                        IsEmpty = !links.Any()
                    };

                    BigBlocks.Add(block1);
                }

            }

            if (BigBlocks.FirstOrDefault(f => f.SectionType == "DosDonts") == null)
            {
                var data = DoDonts();
                var block1 = new WikiPageBlock
                {
                    Base = this,
                    Data = data,
                    SectionType = "DosDonts",
                    Type = SectionType.Links,
                    ArticleId = ArticleId,
                    IsEmpty = false
                };

                BigBlocks.Add(block1);
            }

            if (BigBlocks.FirstOrDefault(f => f.SectionType == "About") == null)
            {
                var block1 = new WikiPageBlock
                {
                    Base = this,
                    Type = SectionType.LayoutCont,
                    SectionType = "About",
                    IsEmpty = false,
                    ArticleId = ArticleId
                };
                BigBlocks.Add(block1);
            }

            if (BigBlocks.FirstOrDefault(f => f.SectionType == "NightLifePrices") == null)
            {
                var block1 = new WikiPageBlock
                {
                    Base = this,
                    Type = SectionType.LayoutCont,
                    SectionType = "NightLifePrices",
                    IsEmpty = false,
                    ArticleId = ArticleId
                };
                BigBlocks.Add(block1);
            }

            if (BigBlocks.FirstOrDefault(f => f.SectionType == "OtherPrices") == null)
            {
                var block1 = new WikiPageBlock
                {
                    Base = this,
                    Type = SectionType.LayoutCont,
                    SectionType = "OtherPrices",
                    IsEmpty = false,
                    ArticleId = ArticleId
                };
                BigBlocks.Add(block1);
            }

            if (BigBlocks.FirstOrDefault(f => f.SectionType == "Photos") == null)
            {
                var block1 = new WikiPageBlock
                {
                    Base = this,
                    Type = SectionType.LayoutCont,
                    SectionType = "Photos",
                    IsEmpty = false,
                    ArticleId = ArticleId
                };
                BigBlocks.Add(block1);
            }
        }

        public List<LinkVM> GetLinksBlockByCategory(string category)
        {
            var links = GetLinksByCategory(category);

            var linkItems = links.Select(b => new LinkVM
            {
                Name = b.Name,
                Id = b.id.ToString(),
                Links = b.Links
            }).ToList();

            return linkItems;
        }

        private List<LinkObjectSE> GetLinksByCategory(string category)
        {
            var links = PlacesLinks.Where(c => c.Category == category).ToList();
            return links;
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



        public virtual List<RelatedLink> GetRelatedLinks()
        {
            return new List<RelatedLink>();
        }

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
}