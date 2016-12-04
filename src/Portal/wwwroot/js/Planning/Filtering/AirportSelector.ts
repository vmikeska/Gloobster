module Planning {


		export class AirportSelector {

				public onChange: Function;

				private pairs: CodePair[];
				private $cont;

				constructor($cont, pairs: CodePair[]) {
					this.pairs = pairs;
					this.$cont = $cont;
				}

			public init() {
				var lg = Common.ListGenerator.init(this.$cont, "air-pair-item-template");

				lg.activeItem = (item) => {
					return { isActive: true, cls: "active" }
				};

				lg.evnt(null, (e, $item, $target, item) => {

					$item.toggleClass("active");

					if (this.onChange) {
						this.onChange();
					}

				});

				lg.generateList(this.pairs);
				}

			public getActive(): CodePair[] {
				var sel: CodePair[] = [];

				var pairs = this.$cont.find(".pair").toArray();
				pairs.forEach((p) => {
					var $p = $(p);

					if ($p.hasClass("active")) {
						sel.push({ from: $p.data("f"), to: $p.data("t") });
					}
				});

				return sel;
			}

			public static toString(pair: CodePair): string {
				return `${pair.from}-${pair.to}`;
			}
		}

	
}