using System.Collections.Generic;
using Gloobster.DomainObjects;
using Gloobster.Enums;

namespace Gloobster.DomainInterfaces
{
    public interface IWikiAdminTasks
    {
        void AddTask(NewTaskDO task);
        List<TaskDO> GetUnresolvedTasks(string userId);        
    }
}