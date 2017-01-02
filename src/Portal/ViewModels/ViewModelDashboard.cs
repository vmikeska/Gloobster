using System.Collections.Generic;
using Gloobster.Entities.Trip;

namespace Gloobster.Portal.ViewModels
{
    public class ViewModelDashboard : ViewModelBase
    {
        public List<TripEntity> Trips { get; set; }
        public List<string> CCs { get; set; }
    }
}