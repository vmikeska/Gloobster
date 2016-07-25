module Common {
	export class FacebookPermissions {

		public initFb(callback: Function) {
			var fbInit = new Reg.FacebookInit();		 
			fbInit.initialize(() => {
					FB.getLoginStatus((response) => {
							//todo: check connected
							callback();
					});					
			});

			
		}

		public hasPermission(permissionsName: string, callback: Function) {
			FB.api("/me/permissions", (permResp) => {
				var found = _.find(permResp.data, (permItem) => {
					return permItem.permission === permissionsName;
				});
				var hasPermissions = found && found.status === "granted";
				callback(hasPermissions);
			});
		}

		public requestPermissions(perm: string, callback: Function) {
			FB.login(response => {
				callback(response);
			},
			{
				scope: perm,
				auth_type: "rerequest"
			});
		}
	}
}