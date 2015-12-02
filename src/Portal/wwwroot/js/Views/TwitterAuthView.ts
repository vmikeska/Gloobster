module Views
{

	export class TwitterAuthView extends ViewBase {

		constructor() {
			super();
		}

		get pageType(): Views.PageType { return PageType.TwitterAuth; }

	}
}