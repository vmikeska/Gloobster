module Common {
	export class CookieManager {

		private domain() {
			var dom = document["mydomain"];
			if (!dom) {
				if (dom.indexOf("localhost") !== -1) {
					return null;
				}
			}
		 
			return dom;
		}

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
			$.cookie(cookieName, cookieValue, { "domain": this.domain(), "path": "/" });
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

