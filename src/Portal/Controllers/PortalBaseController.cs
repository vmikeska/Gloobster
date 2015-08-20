

using Gloobster.Common;

namespace Gloobster.Portal.Controllers
{
    public class PortalBaseController
    {
        public PortalBaseController(IDbOperations db)
        {
            DB = db;
        }


        public IDbOperations DB;
    }
}