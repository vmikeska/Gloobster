class HomePageView extends Views.ViewBase {

	public initialize() {
		
	}

	public googleUserLogged(user) {
	 
	 super.apiPost("GoogleUser", user, response => {
			alert('response;');
		});
	}

}