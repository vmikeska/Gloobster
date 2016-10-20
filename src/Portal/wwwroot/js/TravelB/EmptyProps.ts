module TravelB {
	export class EmptyProps {

		private formTemp;
		
		private $cont;

		private view: Views.TravelBView;

		constructor(view: Views.TravelBView) {
			this.view = view;			
		}

		public generateProps(props) {

			if (props.length === 0) {
				return;
			}

			Views.SettingsUtils.registerAvatarFileUpload("avatarFile", () => {
					this.tbValids.valAvatarBody($("#avatarFile"), $(".photo-cont"), this.avatarValItem);
					this.tbValids.changed();
			});

			this.homeCity = Views.SettingsUtils.registerLocationCombo($("#homeCity"), "HomeLocation");
			this.currentCity = Views.SettingsUtils.registerLocationCombo($("#currentCity"), "CurrentLocation");

			this.homeCity.setText(this.view.homeLocation);

			Views.SettingsUtils.registerEdit("firstName", "FirstName", (value) => {
				return { name: value };
			});

			Views.SettingsUtils.registerEdit("lastName", "LastName", (value) => {
				return { name: value };
			});

			Views.SettingsUtils.registerEdit("birthYear", "BirthYear", (value) => {
				return { year: value };
			});

			Views.SettingsUtils.registerCombo("gender", (val) => {
				return { propertyName: "Gender", values: { gender: val } };
			});

			this.langsTagger = Views.SettingsUtils.initLangsTagger(this.view.defaultLangs);

			this.createTbVals();

			var $v = $(".all-valid");
			$v.find(".lbtn").click((e) => {
				e.preventDefault();
				$(".required-settings").hide();
			});
		}

		private tbValids: FormValidations;
		private homeCity: Common.PlaceSearchBox;
		private currentCity: Common.PlaceSearchBox;
		
		private langsTagger: Planning.TaggingField;
		public langs;

		private avatarValItem;

		private createTbVals() {
			this.tbValids = new FormValidations();
			this.tbValids.valMessage($("#firstName"), $("#firstName"));
			this.tbValids.valMessage($("#lastName"), $("#lastName"));
			this.tbValids.valMessage($("#birthYear"), $("#birthYear"), Views.SettingsUtils.yearValidation);

			this.tbValids.valPlace(this.homeCity, $("#homeCity"), $("#homeCity input"));
			this.tbValids.valPlace(this.currentCity, $("#currentCity"), $("#currentCity input"));
				
			this.tbValids.valTagger(this.langsTagger, $("#langsTagging input"));

			this.tbValids.valDropDownVal($("#gender"), $("#gender .selected"), Gender.N);

			this.avatarValItem = this.tbValids.valAvatar($("#avatarFile"), $(".photo-cont"));

			this.tbValids.onChange = () => {
				var valid = this.tbValids.isAllValid();

				var $v = $(".all-valid");

				if (valid) {
					$v.show();
				} else {
					$v.hide();
				}
			}
		}

	}
}