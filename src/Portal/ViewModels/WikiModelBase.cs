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

    public abstract class WikiModelBase : ViewModelBase
    {   
        public string ArticleId { get; set; }

        public bool IsAdmin { get; set; }

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
                    return new DdVM { Text = item.Text, Id = item.Section_id.ToString() };
                }).ToList(),
                Dos = Dos.Select(i =>
                {
                    var item = GetDoDontItem(i);
                    return new DdVM { Text = item.Text, Id = item.Section_id.ToString() };
                }).ToList()

            };
            return model;
        }


        public SectionTextsSE GetDoDontItem(ObjectId id)
        {
            var item = Texts.Texts.FirstOrDefault(t => t.Section_id == id);

            return item;
        }

        public BlockVM Section(string type, string admin = "standard", int size = 3)
        {
            var section = FindSectionByType(type);
            var text = GetTexts<SectionTextsSE>(section.id);

            return new BlockVM
            {
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