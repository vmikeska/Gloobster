using System.Globalization;
using System.Linq;
using System.Text;
using Gloobster.Database;
using Gloobster.DomainInterfaces;
using Gloobster.Entities;

namespace Gloobster.DomainModels.Wiki
{
    public class NiceLinkBuilder : INiceLinkBuilder
    {
        public IDbOperations DB { get; set; }
        
        public string BuildLinkCity(string name, string countryCode, int gid)
        {
            var basicLink = BuildBasicLink(name);
            
            if (LinkTaken(basicLink))
            {
                var withCC = $"{basicLink}-{countryCode.ToLower()}";
                if (LinkTaken(withCC))
                {
                    var withGid = $"{withCC}-{gid}";
                    return withGid;
                }

                return withCC;
            }

            return basicLink;
        }

        public string BuildBasicLink(string name)
        {
            var name1 = name.Replace(" ", "-");
            var name2 = name1.Replace(".", string.Empty);
            var name3 = name2.Replace("'", string.Empty);
            var name4 = RemoveDiacritics(name3);
            var name5 = name4.ToLower();

            return name5;
        }

        private bool LinkTaken(string linkName)
        {
            var articleByLink = DB.C<WikiTextsEntity>().FirstOrDefault(t => t.LinkName == linkName);
            return articleByLink != null;
        }

        
        
        private string RemoveDiacritics(string s)
        {
            string normalizedString = s.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder();

            for (int i = 0; i < normalizedString.Length; i++)
            {
                char c = normalizedString[i];
                if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                    stringBuilder.Append(c);
            }

            return stringBuilder.ToString();
        }
    }
}