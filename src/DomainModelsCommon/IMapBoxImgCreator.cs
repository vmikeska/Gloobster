using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IMapBoxImgCreator
	{
		string BuildMapLink(BuildMapConfigDO config, string accessToken);
	}
}