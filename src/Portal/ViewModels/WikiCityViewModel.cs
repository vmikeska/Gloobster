using System.Collections.Generic;
using Gloobster.Entities;
using System.Linq;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    public class WikiCityViewModel : ViewModelBase
    {
        public string Title { get; set; }

        public WikiCityEntity Article { get; set; }

        public List<SectionTextsSE> Texts { get; set; }

        private SectionTextsCommonSE _commonText;
        public SectionTextsCommonSE CommonText
        {
            get
            {
                if (_commonText == null)
                {
                    var txt = Texts.FirstOrDefault(t => t.GetType() == typeof(SectionTextsCommonSE) );
                    _commonText = txt as SectionTextsCommonSE;
                }

                return _commonText;
            }
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
    }

    
}