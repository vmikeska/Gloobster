using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IPlacesExtractor
	{
		IPlacesExtractorDriver Driver { get; set; }
		Task<bool> ExtractNewAsync(string dbUserId, SocAuthenticationDO auth);
		void SaveAsync();
	}
}