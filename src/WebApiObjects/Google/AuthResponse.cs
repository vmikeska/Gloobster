using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gloobster.WebApiObjects.Google
{
	public class ExtraQueryParams
	{
		public string authuser { get; set; }
	}

	public class SessionState
	{
		public ExtraQueryParams extraQueryParams { get; set; }
	}

	public class Wc
	{
		public string token_type { get; set; }
		public string access_token { get; set; }
		public string scope { get; set; }
		public string login_hint { get; set; }
		public int expires_in { get; set; }
		public string id_token { get; set; }
		public SessionState session_state { get; set; }
		public long first_issued_at { get; set; }
		public long expires_at { get; set; }
		public int Qa { get; set; }
		public string idpId { get; set; }
	}

	public class LdClass
	{
		public string wc { get; set; }
		public string ye { get; set; }
		public string Ei { get; set; }
		public string Ld { get; set; }
	}

	public class GoogleAuthRequest
	{
		public string El { get; set; }
		public Wc wc { get; set; }
		public LdClass Ld { get; set; }
	}
}
