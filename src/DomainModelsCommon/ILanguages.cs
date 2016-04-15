namespace Gloobster.DomainInterfaces
{
    public interface ILanguages
    {
        void Refresh();
        void InitLangs();
        string GetWord(string moduleName, string key, string lang);
    }
}