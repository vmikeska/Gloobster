using System.Threading.Tasks;

namespace Gloobster.DomainModels.Services.Places
{
	public interface IPlacesExtractor
	{
		IPlacesExtractorDriver Driver { get; set; }
		Task<bool> ExtractNewAsync(string dbUserId, object auth);
		void SaveAsync();
	}
}