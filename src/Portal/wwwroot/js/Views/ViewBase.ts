
module Views {

	export enum PageType {HomePage, PinBoard, TripList, TwitterAuth, Friends}

	export class ViewBase {

	  public static currentView: ViewBase;	 
		public static nets: string;

		public loginButtonsManager: Reg.LoginButtonsManager;

		public loginManager: Reg.LoginManager;
		public cookieManager: Common.CookieManager;

	  public onLogin: Function;

		get pageType(): PageType { return null; }

		constructor() {
			ViewBase.currentView = this;
			this.cookieManager = new Common.CookieManager();			
			this.regUserMenu();

			this.loginButtonsManager = new Reg.LoginButtonsManager();
			this.loginButtonsManager.createPageDialog();
		}

		private regUserMenu() {

		 //todo: fix if is not working
		 $("#logoutUser").click((e) => {				
				this.loginManager.logout();				
			});
		}

		public hasSocNetwork(net: SocialNetworkType) {
			var prms = ViewBase.nets.split(",");

			if (_.contains(prms, net.toString())) {
				return true;
			}

			return false;
		}

		public apiGet(endpointName: string, params: string[][], callback: Function) {

			var endpoint = "/api/" + endpointName;
			console.log("getting: " + endpoint);

			var request = new Common.RequestSender(endpoint, null, true);
			request.params = params;
			request.onSuccess = callback;
			request.onError = response => { alert("error") };
			request.sendGet();
		}

		public apiPost(endpointName: string, data: any, callback: Function) {

			var endpoint = '/api/' + endpointName;
			console.log("posting: " + endpoint);

			var request = new Common.RequestSender(endpoint, data, true);
			request.serializeData();
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sendPost();
		}

		public apiPut(endpointName: string, data: any, callback: Function) {

			var endpoint = '/api/' + endpointName;
			console.log("putting: " + endpoint);

			var request = new Common.RequestSender(endpoint, data, true);
			request.serializeData();
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sendPut();
		}

		public apiDelete(endpointName: string, params: string[][], callback: Function) {

			var endpoint = '/api/' + endpointName;
			console.log("deleting: " + endpoint);

			var request = new Common.RequestSender(endpoint, null, true);
			request.params = params;
			request.onSuccess = callback;
			request.onError = response => { alert('error') };
			request.sendDelete();
		}

		public registerTemplate(name: string) {
		 var source = $("#" + name).html();
		 return Handlebars.compile(source);
		}

	}
}
