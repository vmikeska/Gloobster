using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
    public interface IWikiChangeDomain
    {
        void ReceiveEvent(WikiEventDO evnt);
    }
}