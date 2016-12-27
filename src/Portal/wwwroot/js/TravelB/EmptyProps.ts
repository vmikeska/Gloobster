module TravelB {
	export class EmptyProps {

		public tbValids: FormValidations;

		public langs;

		private formTemp;		
		private homeCity: Common.PlaceSearchBox;
		private currentCity: Common.PlaceSearchBox;
		private langsTagger: Planning.TaggingField;		
		private avatarValItem;
		private $cont;

		private view: Views.TravelBView;

		constructor(view: Views.TravelBView) {
				this.view = view;							
		}

		public generateProps(homeLocDef, currLocDef, defaultLangs) {
				
			Views.SettingsUtils.registerAvatarFileUpload("avatarFile", () => {
					this.tbValids.valAvatarBody($("#avatarFile"), $(".photo-cont"), this.avatarValItem);
					this.tbValids.changed();
			});

			this.homeCity = Views.SettingsUtils.registerLocationCombo($("#homeCity"), "HomeLocation");
			this.currentCity = Views.SettingsUtils.registerLocationCombo($("#currentCity"), "CurrentLocation");

			this.homeCity.setText(homeLocDef);
			this.currentCity.setText(currLocDef);	
			
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

			this.langsTagger = Views.SettingsUtils.initLangsTagger(defaultLangs, this.view.t("LangSearch", "jsTravelB"));

			this.createTbVals();

			var $v = $(".all-valid");
			$v.find("#doneClose").click((e) => {
				e.preventDefault();
				$(".req-settings").hide();
			});
		}

		

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