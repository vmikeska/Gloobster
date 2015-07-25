﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gloobster.Common.DbEntity
{
    public class PortalUser
    {
        public string Id { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
        public string Mail { get; set; }
        public FacebookUser FacebookUser { get; set; }
    }

    public class FacebookUser
    {
        public string AccessToken { get; set; }
        public string UserId { get; set; }
        public int ExpiresIn { get; set; }
        public string SignedRequest { get; set; }
    }


//{
//"accessToken":"CAAVlse7iUKoBAHSjsXdIw35UkzEe4K0D6AkF9ZAC3t054fJXSTvZAaIkLG93Y1dx4Y6o6HpkGQ7mwfaJGBVPy5R6JTDA4b6hPnmUrR27oheNKOmVHio6xphiel6ZBXc548rlQ6jhX6gZAyNuqjiwDoKWnhndzkgCVE4KqpVcD6wvdxPMJpepHJs9ezwYDaA4YqCDT9ql8XPgye0MsR08"
//    ,"userID":"10202803343824427",
//    "expiresIn":6656,
//    "signedRequest":"Dsb4yieFzW9pxVq5Gb_v337SchOEknrGJmYTBGjhnoE.eyJhbGdvcml0aG0iOiJITUFDLVNIQTI1NiIsImNvZGUiOiJBUUE3b1BJb20xcjhxS3NBU0Zwd2dGaVpGRkR0Nk1JVjBFUW94aE1CMlkzZFl5dVFubkdRYmpWQURlekFoSThuZmJHM1hwSEppd1U4V3Bvb01PTmRXUDBFZThrOXozblpNa3FhQ25td2lxclJlaVZiTHZ1ajZKSUdtN2o2WVhEeEN4NGZZUlZ4TE5xUWVMNUZjWTlmZnR0Umw5VlY0WXRCMkVYbk1UYlBaamhNX0gwSUh4OURwWGpfQkp5bTFTQ1Y1QjBPQmw3ZUdKNjdBNzc1cFBHQ244ejFjOGZoZjFFTzF6cDF3a1VYRElTNXJDbWZlYkZVcExoc1NXeHlDNFJ3RDJ1WlpKOU9tZ2JueDNMaE5oYzIxekU0bHdUbnBOLUE0VlQ2WjdlcEM5bFh0ZkxSNnVzc0dzSGJfakFNNWRWellEV21GZms1ZVpiZERxYlZiOGY3V284NmJwZXVEMGJmXzhhbnVxMkdybC1Td3ciLCJpc3N1ZWRfYXQiOjE0Mzc4Mjk3NDQsInVzZXJfaWQiOiIxMDIwMjgwMzM0MzgyNDQyNyJ9"
//}
}
