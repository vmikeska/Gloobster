using System.IO;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
    public interface IArticlePhoto
    {
        Task<bool> Confirm(string userId, string articleId, string photoId);
        bool Delete(string userId, string articleId, string photoId);
        //void SaveVersionCreate(Stream stream, string articleId);
        string ReceiveFilePart(string articleId, string userId, WriteFilePartDO filePartDo);
    }
}