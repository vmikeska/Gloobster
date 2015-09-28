using System.Threading.Tasks;
using Gloobster.DomainModelsCommon.DO;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IPlacesExtractor
	{
		IPlacesExtractorDriver Driver { get; set; }
		Task<bool> ExtractNewAsync(string dbUserId, SocAuthenticationDO auth);
		void SaveAsync();
	}
}