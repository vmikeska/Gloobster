using System.Collections.Generic;
using Gloobster.Entities.Wiki;

namespace Gloobster.Portal.ViewModels
{
    public class WikiLinkMapViewModel : ViewModelBase
    {
        public List<WikiLanguageVM> Languages { get; set; }
    }

    public class WikiLanguageVM
    {
        public string Language { get; set; }

        public List<WikiLinkVM> Continents { get; set; }

        public List<WikiCountryVM> Countries { get; set; }        
    }

    
    public class WikiCountryVM
    {
        public WikiLinkVM Country { get; set; }

        public List<WikiLinkVM> Cities { get; set; }
    }

    public class WikiLinkVM
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Link { get; set; }
    }

    
}