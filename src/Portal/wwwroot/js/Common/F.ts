module Common {

	export class F {

		public static tryParseInt(str, defaultValue = null) {
			var retValue = defaultValue;
			if (str) {
				if (str.length > 0) {
					if (!isNaN(str)) {
						retValue = parseInt(str);
					}
				}
			}
			return retValue;
		}


	}

}