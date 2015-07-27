using Gloobster.Common;

namespace Goobster.Portal.Controllers
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