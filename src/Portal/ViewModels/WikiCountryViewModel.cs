using System.Collections.Generic;
using Gloobster.Entities;
using Gloobster.Entities.Wiki;
using MongoDB.Bson;
using System.Linq;

namespace Gloobster.Portal.ViewModels
{
    public class WikiCountryViewModel : ViewModelBase
    {
        public WikiCountryEntity Article { get; set; }

        public List<SectionTextsSE> Texts { get; set; }

        public SectionTextsCommonSE BaseTexts { get; set; }

        public List<DoDontTextSE> DosDonts { get; set; }

        public BlockVM Section(string type)
        {
            var section = FindSectionByType(type);
            var text = GetTexts<SectionTextsSE>(section.id);

            return new BlockVM { Text = text.Text, Type = type };
        }

        public DoDontsVM DoDonts()
        {
            var model = new DoDontsVM
            {
                Donts = Article.Donts.Select(i =>
                {
                    var item = GetDoDontItem(i);
                    return new DdVM { Text = item.Text, Id = item.DoDont_id.ToString() };
                }).ToList(),
                Dos = Article.Dos.Select(i =>
                {
                    var item = GetDoDontItem(i);
                    return new DdVM { Text = item.Text, Id = item.DoDont_id.ToString() };
                }).ToList()

            };
            return model;
        }

        public DoDontTextSE GetDoDontItem(ObjectId id)
        {
            var item = DosDonts.FirstOrDefault(t => t.DoDont_id == id);

            return item;
        }


        public T GetSectionText<T>(string type) where T : SectionTextsSE
        {
            var section = FindSectionByType(type);
            var text = GetTexts<SectionTextsSE>(section.id);

            return text as T;
        }

        public SectionSE FindSectionByType(string type)
        {
            var sect = Article.Sections.FirstOrDefault(s => s.Type == type);
            if (sect == null)
            {
                //todo: something
            }
            return sect;
        }

        public T GetTexts<T>(ObjectId id) where T : SectionTextsSE
        {
            var text = Texts.FirstOrDefault(t => t.Section_id == id);
            if (text == null)
            {
                //todo: something
            }

            return text as T;
        }

        //public DoDontTextSE GetDoDontItem(ObjectId id)
        //{
        //    var item = DosDonts.FirstOrDefault(t => t.DoDont_id == id);

        //    return item;
        //}
    }
}