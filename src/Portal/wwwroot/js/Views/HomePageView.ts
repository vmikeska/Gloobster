﻿class HomePageView extends Views.ViewBase {

	constructor() {		
		super();
	}

	public registerNormal(mail: string, password: string) {

		var data = { "mail": mail, "password": password };
		super.apiPost("User", data, response => {
			alert("user registred");
		});
	}
 
}