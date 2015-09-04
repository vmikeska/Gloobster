

class MapsCreatorMapBox2D implements Maps.IMapsCreator {

 public rootElement: string;
 public mapType: any;

 public mapObj: any;

 setRootElement(rootElement: string) {
	this.rootElement = rootElement;
 }

 setMapType(mapType) {
	this.mapType = mapType;
 }

 show() {	
	L.mapbox.accessToken = 'pk.eyJ1IjoiZ2xvb2JzdGVyIiwiYSI6ImQxZWY5MjRkZjU1NDk2MGU3OWI2OGRiM2U3NTM0MGYxIn0.nCG7hOsSQzb0c-_qzfTCRQ';	
	this.mapObj = L.mapbox.map(this.rootElement, 'gloobster.afeef633');
 }

	hide() {
	 //$("#" + this.rootElement).empty();
		this.mapObj.remove();
	}
};