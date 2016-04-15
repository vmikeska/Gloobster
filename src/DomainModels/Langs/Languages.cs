using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Xml.Linq;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.DomainModels.Services.Accounts;
using Gloobster.Entities;

namespace Gloobster.DomainModels.Langs
{
    public class Languages : ILanguages
    {
        public IDbOperations DB { get; set; }

        private readonly string[] _mods = { "sharing",  "notifications", "login", "layout",
            "jsLayout", "jsFriends", "jsPins", "jsTrip", "jsWiki",
            "pageFriends", "pageNotifications", "pageUserSettings", "pageHomeOld", "pageTripShare", "pagePins", "pageTrips", "pageTripDetail", "pageWikiHome", "pageWikiPage" };

        public Dictionary<string, LangModule> Modules = new Dictionary<string, LangModule>();

        private readonly List<string> ModTxt = new List<string>();

        public void InitLangs()
        {
            if (!ModTxt.Any())
            {
                Refresh();
            }
        }

        public void Refresh()
        {
            DownloadModueles();

            //var modules = DB.List<LangModuleEntity>();

            foreach (var xml in ModTxt)
            {
                LoadModuleFromXml(xml);
            }
        }

        public List<WordPair> GetModuleTexts(string moduleName, string lang)
        {
            if (!Modules.ContainsKey(moduleName))
            {
                throw new Exception("ModuleNotFound");
            }

            var module = Modules[moduleName];
            
            var words = new List<WordPair>();
            foreach (var word in module.Words)
            {                
                var texts = word.Value.Texts;
                var text = texts["en"];
                if (texts.ContainsKey(lang))
                {
                    text = texts[lang];
                }
                
                words.Add(new WordPair
                {
                    Name = word.Key,
                    Text = text
                });
            }

            return words;
        }

        public string GetWord(string moduleName, string key, string lang)
        {
            if (!Modules.ContainsKey(moduleName))
            {
                return "ModuleNotFound";
            }

            var module = Modules[moduleName];

            if (!module.Words.ContainsKey(key))
            {
                return "WordNotFound";
            }

            var word = module.Words[key];
            if (word.Texts.ContainsKey(lang))
            {
                return word.Texts[lang];
            }

            return word.Texts["en"];
        }

        private void DownloadModule(string name)
        {
            var link = $"{GloobsterConfig.Protocol}://{GloobsterConfig.Domain}/langs/{name}.xml";

            using (var client = new WebClient())
            {                
                string xml = client.DownloadString(link);
                ModTxt.Add(xml);
            }
        }

        private void DownloadModueles()
        {            
            foreach (var name in _mods)
            {
                DownloadModule(name);
            }
        }
        
        private void LoadModuleFromXml(string xml)
        {
            var doc = XDocument.Parse(xml);
            
            var modName = doc.Root.Attribute("name").Value;

            LangModule mod;
            if (!Modules.ContainsKey(modName))
            {
                mod = new LangModule { Name = modName };
                Modules.Add(modName, mod);
            }
            else
            {
                mod = Modules[modName];
            }

            ExtractModule(doc, mod);
        }

        private void ExtractModule(XDocument doc, LangModule module)
        {            
            foreach (var wordItem in doc.Root.Elements())
            {
                string wordName = wordItem.Name.LocalName;

                if (module.Words.ContainsKey(wordName))
                {
                    throw new Exception($"Word '{wordName}' is already in the module {module.Name}");
                }

                var word = new WordItem
                {
                    Name = wordName,
                    Texts = new Dictionary<string, string>()
                };

                foreach (var langItem in wordItem.Elements())
                {
                    string lang = langItem.Name.LocalName;
                    string text = langItem.Value;
                    
                    word.Texts.Add(lang, text);  
                }

                module.Words.Add(wordName, word);
            }

        }
    }


    public class LangModule
    {
        public string Name { get; set; }

        public Dictionary<string, WordItem> Words = new Dictionary<string, WordItem>();        
    }

    public class WordItem
    {
        public string Name { get; set; }
        //lang, text
        public Dictionary<string, string> Texts { get; set; }
    }

    public class WordPair
    {
        public string Name { get; set; }        
        public string Text { get; set; }
    }
}
