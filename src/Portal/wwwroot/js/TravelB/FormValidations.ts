module TravelB {

		
	export class FormValidations {

		public onChange: Function;

		private ic = "invalid";
			
		public validatedItems = [];

		public isAllValid() {
				var allValid = true;

				this.validatedItems.forEach((i) => {

						if (!i.state) {
								allValid = false;
						}
				});

				return allValid;
		}

		private addItemVal() {
			var i = { state: false };
			this.validatedItems.push(i);
			return i;
		}

		public valDropDownVal($combo, $frame, invalidVal) {
				var valItem = this.addItemVal();

				this.valDropDownValBody($combo, $frame, valItem, invalidVal);
				
				var $i = $combo.find("input");
				$i.change(() => {
						this.valDropDownValBody($combo, $frame, valItem, invalidVal);						
				});
		}

		public valDropDownValBody($combo, $frame, valItem, invalidVal) {
			var $i = $combo.find("input");

			var val = $i.val();
			var isValid = parseInt(val) !== invalidVal;

			valItem.state = isValid;
			this.changed();

			this.visual(isValid, $frame);

			return isValid;
		}

		public valTagger(tagger: Planning.TaggingField, $frame) {
			var valItem = this.addItemVal();

			this.valTaggerBody(tagger, $frame, valItem);

			tagger.onChange = () => {
				this.valTaggerBody(tagger, $frame, valItem);
			};
		}

		private valTaggerBody(tagger: Planning.TaggingField, $frame, valItem) {
			var anyItems = tagger.selectedItems.length > 0;

			valItem.state = anyItems;
			this.changed();

			this.visual(anyItems, $frame);
			return anyItems;
		}

		public valPlace(box: Common.PlaceSearchBox, $combo, $frame) {
				var valItem = this.addItemVal();

				this.valPlaceBody(box, $combo, $frame, valItem);
				
				$combo.change(() => {
						this.valPlaceBody(box, $combo, $frame, valItem);
				});
		}

		private valPlaceBody(box: Common.PlaceSearchBox, $combo, $frame, valItem) {
			var isSelected = (box.lastText != undefined) && (box.lastText.length > 0);

			valItem.state = isSelected;
			this.changed();

			this.visual(isSelected, $frame);

			return isSelected;
		}

		public valWantDo(tagger: CategoryTagger, $frame) {				
				var valItem = this.addItemVal();				

				this.valWantDoBody(tagger, $frame, valItem);

				tagger.onFilterChange = () => {
						this.valWantDoBody(tagger, $frame, valItem);						
				}
		}

		private valWantDoBody(tagger: CategoryTagger, $frame, valItem) {
			var anySelected = tagger.getSelectedIds().length > 0;
			
			valItem.state = anySelected;
			this.changed();

			this.visual(anySelected, $frame);

			return anySelected;
		}

		public valMessage($txt, $frame, customVal: Function = null) {
				var valItem = this.addItemVal();

				this.valMessageBody($txt, $frame, valItem, customVal);
				
				var dc = new Common.DelayedCallback($txt);
				dc.callback = (val) => {
						this.valMessageBody($txt, $frame, valItem, customVal);						
				};				
		}

		private valMessageBody($txt, $frame, valItem, customVal: Function = null) {
				var val = $txt.val();

				var hasText = val.length > 0;
				var isValid = hasText;

				if (isValid && customVal) {
					isValid = customVal(val);
				}

				valItem.state = isValid;
				this.changed();

				this.visual(isValid, $frame);
				
				return isValid;
		}

		public valAvatar($input, $frame) {
			var valItem = this.addItemVal();

			this.valAvatarBody($input, $frame, valItem);
			return valItem;
		}

		public valAvatarBody($input, $frame, valItem) {
				var hasImg = Boolean($input.data("valid"));

				valItem.state = hasImg;				
				this.changed();

				this.visual(hasImg, $frame);
				
				return hasImg;
		}

		public changed() {
				if (this.onChange) {
						this.onChange();
				}
		}

		private visual(isValid: boolean, $frame) {
				if (isValid) {
						$frame.removeClass(this.ic);
				} else {
						$frame.addClass(this.ic);
				}				
		}

	}
}