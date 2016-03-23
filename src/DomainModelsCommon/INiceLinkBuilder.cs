namespace Gloobster.DomainInterfaces
{
    public interface INiceLinkBuilder
    {
        string BuildLinkCity(string name, string countryCode, int gid);
        string BuildBasicLink(string name);
    }
}