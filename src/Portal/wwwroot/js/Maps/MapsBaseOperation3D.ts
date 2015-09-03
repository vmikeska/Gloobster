




class MapsBaseOperation3D implements Maps.IMapsBaseOperation {

		public earth: any;

		constructor(earth: any) {
				this.earth = earth;
		} 

		public drawPolygon(polygonCoordinates, polygonConfig: Maps.PolygonConfig) {
				var polygon = WE.polygon(polygonCoordinates, {
						color: polygonConfig.borderColor,
						opacity: polygonConfig.borderOpacity,
						weight: polygonConfig.borderWeight,

						fillColor: polygonConfig.fillColor,
						fillOpacity: polygonConfig.fillOpacity
						
				}).addTo(this.earth);	
		}

		public drawPin(lat: number, lng: number) {
				var marker = WE.marker([lat, lng]).addTo(this.earth);
		}

}



			//polygon.onClick(function(e) {
			//	 alert('poly!');
			//	});

				
			//setTimeout(function() {
			//		//polygon.setFillColor(polygonConfig.fillColor, polygonConfig.fillOpacity);
			//		polygon.destroy();
			//}, 5000);