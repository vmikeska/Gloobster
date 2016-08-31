module Views {
		
	export class Switcher {

		private acls = "active";

		public onChange: Function;
			
		public groups = [{ name: "data-type", act: 0}];

		public init() {

			this.groups.forEach((g) => {
				var $g = $(`.${g.name}`);
				
				var $aact = $g.find(`a[data-gv="${g.act}"]`);
				$aact.addClass(this.acls);
				
				$g.find("a").click((e) => {
					e.preventDefault();
					var $a = $(e.target).closest("a");

					var val = $a.data("gv");
						
					$g.find("a").removeClass(this.acls);	
					$a.addClass(this.acls);
							
					g.act = val;
					
					this.onChange(g.name, val);								
				});
			});

		}

		public setGroupVal(name, val) {
			var g = this.getGroup(name);
			g.act = val;

			var $g = $(`.${g.name}`);
			$g.find("a").removeClass("active");

			var $aact = $g.find(`a[data-gv="${g.act}"]`);
			$aact.addClass("active");

			this.onChange(name, val);		
		}

		public getGroup(name) {
			var g = _.find(this.groups, (g) => { return g.name === name; });
			return g;
		}

		public getGroupVal(name) {
			var g = this.getGroup(name);
			return g.act;
		}

	}
}