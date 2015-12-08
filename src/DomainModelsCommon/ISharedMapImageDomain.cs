using System.IO;

namespace Gloobster.DomainInterfaces
{
	public interface ISharedMapImageDomain
	{
		Stream GetMap(string tripId);
		string GenerateMapLink(string tripId);
	}
}