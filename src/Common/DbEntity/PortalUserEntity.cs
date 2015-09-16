using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gloobster.Common.DbEntity
{
    public class PortalUserEntity : EntityBase
    {
        public string DisplayName { get; set; }
        public string Password { get; set; }
        public string Mail { get; set; }
        public FacebookGroupEntity Facebook { get; set; }
		public TwitterUserEntity Twitter { get; set; }
	}
}
