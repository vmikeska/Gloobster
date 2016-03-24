using System.Collections.Generic;
using Gloobster.Enums;

namespace Gloobster.DomainObjects
{
    public class NewTaskDO
    {
        public string ArticleId { get; set; }
        public string TargetId { get; set; }
        public AdminTaskType TaskType { get; set; }
        public string Data { get; set; }
    }

    public class TaskDO
    {   public string Id { get; set; }
        public string ArticleId { get; set; }
        public string TargetId { get; set; }
        public AdminTaskType TaskType { get; set; }
        public string Data { get; set; }

        public string Caption { get; set; }
        public List<ActionDO> Actions { get; set; }
    }

    public class ActionDO
    {
        public string Caption { get; set; }
        public string Name { get; set; }
    }

    public class TaskExecuteDO
    {
        public string TaskId { get; set; }
        public string UserId { get; set; }


        public string ArticleId { get; set; }
        public string TargetId { get; set; }        
    }

    public class NewReportDO
    {
        public string Text { get; set; }
        public string ArticleId { get; set; }
        public string SectionId { get; set; }
        public string UserId { get; set; }        
        public string Lang { get; set; }
    }
}