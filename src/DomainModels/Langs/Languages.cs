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

        private readonly string[] _mods = { "pageHomeOld", "login", "pagePins", "pageTrips" };

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

        public string GetWordServer(string moduleName, string key, string lang)
        {
            if (!Modules.ContainsKey(moduleName))
            {
                return "ModuleNotFound";
            }

            var module = Modules[moduleName];

            if (!module.Server.ContainsKey(key))
            {
                return "WordNotFound";
            }

            var word = module.Server[key];
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

            ExtractModuleSection(doc, mod.Client, "client");
            ExtractModuleSection(doc, mod.Server, "server");
            ExtractModuleSection(doc, mod.Common, "common");            
        }

        private void ExtractModuleSection(XDocument doc, Dictionary<string, WordItem> section, string name)
        {
            var sect = doc.Root.Element(name);
            foreach (var wordItem in sect.Elements())
            {
                string wordName = wordItem.Name.LocalName;

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

                section.Add(wordName, word);
            }

        }
    }


    public class LangModule
    {
        public string Name { get; set; }

        public Dictionary<string, WordItem> Client = new Dictionary<string, WordItem>();
        public Dictionary<string, WordItem> Server = new Dictionary<string, WordItem>();
        public Dictionary<string, WordItem> Common = new Dictionary<string, WordItem>();
    }

    public class WordItem
    {
        public string Name { get; set; }
        //lang, text
        public Dictionary<string, string> Texts { get; set; }
    }
}
