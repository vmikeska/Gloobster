using System.Collections.Generic;
using Gloobster.Entities;

namespace Gloobster.Portal.ViewModels
{
    public class WikiHomeViewModel : ViewModelBase
    {
        public List<WikiTextsEntity> Texts { get; set; }
    }
}