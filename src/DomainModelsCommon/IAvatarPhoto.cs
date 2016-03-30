using System.IO;
using System.Threading.Tasks;

namespace Gloobster.DomainInterfaces
{
    public interface IAvatarPhoto
    {
        void CreateThumbnails(string location, Stream originalFile);
        Task UpdateFileSaved(string userId);
        void DeleteOld(string location);
    }
}