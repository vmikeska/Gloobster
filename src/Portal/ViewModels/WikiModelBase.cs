using System.Collections.Generic;
using System.Linq;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    public class LangVersionVM
    {
        public string Language { get; set; }
        public string LinkName { get; set; }
    }

    public class Breadcrumb
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Link { get; set; }
    }

    public class RelatedLink
    {
        public string Name { get; set; }
        public string Link { get; set; }
    }

    public abstract class WikiModelBase : ViewModelBase
    {   
        public string ArticleId { get; set; }

        public bool IsAdmin { get; set; }

        public virtual List<RelatedLink> GetRelatedLinks()
        {
            return new List<RelatedLink>();            
        }

        public WikiTextsEntity Texts { get; set; }
        public abstract List<SectionSE> Sections { get; }

        public abstract List<ObjectId> Dos { get; }
        public abstract List<ObjectId> Donts { get; }

        public List<LangVersionVM> LangVersions { get; set; }

        public string GetLangName(string langCode)
        {
            if (langCode == "en")
            {
                return "English";
            }

            if (langCode == "de")
            {
                return "Deutsch";
            }

            return null;
        }

        public BlockVM BaseText()
        {
            var block = Section("Base");
            return block;
        }

        public DoDontsVM DoDonts()
        {
            var model = new DoDontsVM
            {
                Donts = Donts.Select(i =>
                {
                    var item = GetDoDontItem(i);
                    return new DdVM
                    {
                        Text = item.Text,
                        Id = item.Section_id.ToString(),
                        Liked = WasLiked(item)
                    };
                }).ToList(),
                Dos = Dos.Select(i =>
                {
                    var item = GetDoDontItem(i);
                    return new DdVM
                    {
                        Text = item.Text,
                        Id = item.Section_id.ToString(),
                        Liked = WasLiked(item)
                    };
                }).ToList()

            };
            return model;
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

        public string GetNameFromContinent(Continent c)
        {
            switch (c)
            {
                case Continent.Africa:
                    return "Africa";
                case Continent.Europe:
                    return "Europe";
                case Continent.Australia:
                    return "Australia";
                case Continent.Antarctica:
                    return "Antarctica";
                case Continent.SouthAmerica:
                    return "South America";
                case Continent.NorthAmerica:
                    return "North America";
                case Continent.Asia:
                    return "Asia";                    
            }

            return "Default";
        }

        public SectionTextsSE GetDoDontItem(ObjectId id)
        {
            var item = Texts.Texts.FirstOrDefault(t => t.Section_id == id);

            return item;
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

        public BlockVM Section(string type, string admin = "standard", int size = 3)
        {
            var section = FindSectionByType(type);
            var text = GetTexts<SectionTextsSE>(section.id);
            
            return new BlockVM
            {
                Liked = WasLiked(text),
                SectionId = section.id.ToString(),
                Text = text.Text,
                Type = type,
                Size = size,
                Admin = admin
            };
        }

        

        public T GetSectionText<T>(string type) where T : SectionTextsSE
        {
            var section = FindSectionByType(type);
            var text = GetTexts<SectionTextsSE>(section.id);

            return text as T;
        }

        public SectionSE FindSectionByType(string type)
        {
            var sect = Sections.FirstOrDefault(s => s.Type == type);
            if (sect == null)
            {
                //todo: something
            }
            return sect;
        }

        public T GetTexts<T>(ObjectId id) where T : SectionTextsSE
        {
            var text = Texts.Texts.FirstOrDefault(t => t.Section_id == id);
            if (text == null)
            {
                //todo: something
            }

            return text as T;
        }
    }
}