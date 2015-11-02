class DelayedCallback {	

	public callback: Function;

	public delay = 1000;

	private timeoutId = null;
	private $input: any;

	constructor(inputId: string) {
		this.$input = $("#" + inputId);
		this.$input.keydown(() => { this.keyPressed() }); 
	}

	private keyPressed() {
	
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;		
		}
		this.timeoutId = setTimeout(() => {
			this.timeoutId = null;
			var val = this.$input.val();
			this.callback(val);

		}, this.delay);
	}  
}