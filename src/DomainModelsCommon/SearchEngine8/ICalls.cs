namespace Gloobster.DomainInterfaces.SearchEngine8
{
    public interface ICalls
    {
        T CallServer<T>(string query);
    }
}