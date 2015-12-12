module Trip {

 export class AcceptComboConfig {
	 public tripId: string;	 
	 public comboId: string;
	 public initialState: ParticipantState;
 }

 export class AcceptCombo {
	 private $combo: any;
		private $ul: any;
		private $selected: any;
	  private tripId: string;
		private config: AcceptComboConfig;


		constructor(config: AcceptComboConfig) {
			this.config = config;
			this.$combo = $("#" + config.comboId);
			this.$ul = this.$combo.find("ul");
			this.$selected = this.$combo.find(".selected");

			this.initState(config.initialState);

			this.$ul.find("li").click((e) => this.onClick(e));
		}

    private onClick(e) {
	    var $li = $(e.target);
			var val = $li.data("value");

			var data = {
			 tripId: this.config.tripId,			 
			 newState: parseInt(val) 
			};

			Views.ViewBase.currentView.apiPut("TripInvitationState", data, (res) => {
				
			});
    }

	private initState(state: ParticipantState) {
			this.setHtmlContByState(state);
		}

		private setHtmlContByState(state: ParticipantState) {
		 var $li = this.$ul.find(`li[data-value="${state}"]`);
		 this.$selected.html($li.html());
		}
	
 }
}