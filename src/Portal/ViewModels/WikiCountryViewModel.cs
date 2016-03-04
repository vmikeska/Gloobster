using System.Collections.Generic;
using Gloobster.Entities.Wiki;
using MongoDB.Bson;

namespace Gloobster.Portal.ViewModels
{
    public class WikiCountryViewModel : WikiModelBase
    {        
        public WikiCountryEntity Article { get; set; }
        
        public override List<SectionSE> Sections => Article.Sections;
        public override List<ObjectId> Dos => Article.Dos;
        public override List<ObjectId> Donts => Article.Donts;        
    }
}