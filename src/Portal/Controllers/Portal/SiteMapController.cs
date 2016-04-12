using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using Gloobster.Common;
using Gloobster.Database;
using Gloobster.Portal.Controllers.Base;
using Microsoft.AspNet.Mvc;
using Serilog;
using System.Xml.Serialization;
using Gloobster.Entities;
using System.Linq;
using Autofac;
using Gloobster.DomainInterfaces;

namespace Gloobster.Portal.Controllers.Portal
{
    public class SiteMapController : PortalBaseController
    {
        private SiteMapCreator Creator { get; set; }

        public SiteMapController(ILogger log, IDbOperations db, IComponentContext cc, ILanguages langs) : base(log, db, cc, langs)
        {
            Creator = new SiteMapCreator();
        }
    
	    public IActionResult Sitemap()
	    {
	        Creator.DB = DB;
            Creator.AddWikiItems();
            var xml = Creator.Serialize();

            return Content(xml, "text/xml");
        }
        
	}

    public class SiteMapCreator
    {
        public IDbOperations DB { get; set; }

        public Urlset Urlset;

        public SiteMapCreator()
        {
            Urlset = new Urlset
            {
                Items = new List<SiteMapItem>(),                
            };            
        }

        public void AddWikiItems()
        {
            var articles = DB.C<WikiTextsEntity>().Where(e => e.Rating > 0).ToList();

            foreach (var article in articles)
            {
                var date = article.Updated ?? article.Created;
                AddWikiItem(article.LinkName, article.Language, date);
            }
        }

        public void AddWikiItem(string linkName, string lang, DateTime updated)
        {
            var link = $"{GloobsterConfig.Protocol}://{GloobsterConfig.Domain}/wiki/{lang}/{linkName}";
            
            var item = new SiteMapItem
            {
                loc = link,
                changefreq = "weekly",
                lastmod = updated,
                priority = 0.8m
            };
            Urlset.Items.Add(item);
        }

        public string Serialize()
        {
            var res = XmlSerialization.Serialize(Urlset);
            
            res = res.Remove(0, res.IndexOf(">") + 1);

            var toReplace = res.Substring(0, res.IndexOf(">") + 1);
            var header = @"<urlset xmlns=""http://www.sitemaps.org/schemas/sitemap/0.9"">";
            res = res.Replace(toReplace, header);
            
            return res;
        }

    }

    public class XmlSerialization
    {
        public static string Serialize<T>(T value)
        {

            if (value == null)
            {
                return null;
            }

            var serializer = new XmlSerializer(typeof(T));

            var settings = new XmlWriterSettings
            {
                Encoding = new UnicodeEncoding(false, false),
                Indent = false,
                OmitXmlDeclaration = false
            };
            // no BOM in a .NET string

            using (var textWriter = new StringWriter())
            {
                using (var xmlWriter = XmlWriter.Create(textWriter, settings))
                {
                    serializer.Serialize(xmlWriter, value);
                }
                return textWriter.ToString();
            }
        }

        public static T Deserialize<T>(string xml)
        {
            if (string.IsNullOrEmpty(xml))
            {
                return default(T);
            }

            var serializer = new XmlSerializer(typeof(T));

            var settings = new XmlReaderSettings();
            // No settings need modifying here

            using (var textReader = new StringReader(xml))
            {
                using (var xmlReader = XmlReader.Create(textReader, settings))
                {
                    return (T)serializer.Deserialize(xmlReader);
                }
            }
        }
    }


    [XmlRoot(ElementName = "urlset", Namespace = "")]
    
    public class Urlset
    {
        [XmlElement("url")]        
        public List<SiteMapItem> Items = new List<SiteMapItem>();        
    }

    public class SiteMapItem
    {
                
        public string loc { get; set; }
        public DateTime lastmod { get; set; }
        public string changefreq { get; set; }
        public decimal priority { get; set; }
        
    }

}
