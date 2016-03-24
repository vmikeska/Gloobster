using System.Collections.Generic;
using Gloobster.DomainObjects;

namespace Gloobster.Portal.ViewModels
{
    public class AdminTasksViewModel : ViewModelBase
    {
        public List<TaskDO> Tasks { get; set; }
    }
}