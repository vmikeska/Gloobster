using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
    public interface IImgDbDomain
    {
        Task<string> AddNewPhoto(NewDbImgDO newPhoto);
        Task UpdateImageCut(UpdateDbImgCutDO update);
        Task DeletePhoto(ImgDbPhotoDelDO del);
        Task SetDefaultCityPhotoCut(DefaultDO req);
        Task AddNewCut(CutDO cutDo);
    }
}