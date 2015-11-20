using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Gloobster.DomainObjects;

namespace Gloobster.DomainInterfaces
{
	public interface IPlanningDomain
	{
		Task<bool> ChangeCountrySelection(string userId, string countryCode, bool selected);
		void CreateDBStructure(string userId);
	}
}
