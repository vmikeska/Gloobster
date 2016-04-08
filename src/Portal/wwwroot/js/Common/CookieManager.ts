module Common {
	export class CookieManager {

		//todo: change in production
		private domain = null;

		public getString(cookieName: string) {
			var value = $.cookie(cookieName);			
			return value;
		}
	 
		public getJson(cookieName: string) {
			var valStr = this.getString(cookieName);

			if (!valStr) {
				return null;
			}

			var valObj = JSON.parse(valStr);
			return valObj;
		}

		public setString(cookieName: string, cookieValue: string) {			
			$.cookie(cookieName, cookieValue, { "domain": this.domain, "path": "/" });
		}

		public setJson(cookieName: string, cookieValue) {

			var valStr = JSON.stringify(cookieValue);
			this.setString(cookieName, valStr);
		}

		public removeCookie(cookieName: string) {
			$.removeCookie(cookieName, { path: "/" });
		}
	}
}

