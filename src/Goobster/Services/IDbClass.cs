using System.Collections.Generic;
using System.Threading.Tasks;

namespace Goobster.Portal.Services
{
    public interface IDbClass
    {
        void Save(object entity);
        //T GetById<T>(int id);
        List<T> Find<T>(string query);
    }
}