module Common {
	export class Popup {

	  public static register($p) {
		  $p.find(".close").click((e) => {
			  e.preventDefault();
			  $p.hide();
		  });
	  }
		

		public static init() {
				$(document).ready(() => {					
						$(".popup-n").toArray().forEach((c) => {
							var $p = $(c);
							this.register($p);
						});					
				});
		}

	}
}