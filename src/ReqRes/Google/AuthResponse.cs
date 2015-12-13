namespace Gloobster.ReqRes.Google
{
	public class ExtraQueryParams
	{
		public string authuser { get; set; }
	}

	public class SessionState
	{
		public ExtraQueryParams extraQueryParams { get; set; }
	}

	public class Po
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
		public string idpId { get; set; }
	}

	public class Zt
	{
		public string wc { get; set; }
		public string zt { get; set; }
		public string Ph { get; set; }
		public string hg { get; set; }
		public string Ei { get; set; }
		public string po { get; set; }
	}

	public class GoogleAuthRequest
	{
		public string El { get; set; }
		public Po po { get; set; }
		public Zt zt { get; set; }
	}
	
}
