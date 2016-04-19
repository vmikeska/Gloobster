module Common {
	export class CookieManager {
	 
		public getString(cookieName: string) {			
			var value = Cookies.get(cookieName);			
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
		 Cookies.set(cookieName, cookieValue, { expires: 365 });
		}

		public setJson(cookieName: string, cookieValue) {

			var valStr = JSON.stringify(cookieValue);
			this.setString(cookieName, valStr);
		}

		public removeCookie(cookieName: string) {
		 Cookies.remove(cookieName);
		}
	}
}

