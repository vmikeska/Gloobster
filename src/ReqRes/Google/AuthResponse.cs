namespace Gloobster.ReqRes.Google
{

    public class GoogleTokenData
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

    public class GoogleUserParams
    {
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PhotoLink { get; set; }
        public string Mail { get; set; }
    }

    public class ExtraQueryParams
    {
        public string authuser { get; set; }
    }

    public class SessionState
    {
        public ExtraQueryParams extraQueryParams { get; set; }
    }


}
