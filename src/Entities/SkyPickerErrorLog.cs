using System;
using Gloobster.Database;

namespace Gloobster.Entities
{
    public class SkyPickerErrorLog : EntityBase
    {
        public DateTime Date { get; set; }
        public string Text { get; set; }
    }
}