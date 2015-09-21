using System.Threading.Tasks;

namespace Gloobster.DomainModelsCommon.Interfaces
{
	public interface IPlacesExtractor
	{
		IPlacesExtractorDriver Driver { get; set; }
		Task<bool> ExtractNewAsync(string dbUserId, object auth);
		void SaveAsync();
	}
}