var MapsBaseOperation3D = (function () {
    function MapsBaseOperation3D(earth) {
        this.earth = earth;
    }
    MapsBaseOperation3D.prototype.drawPolygon = function (polygonCoordinates, polygonConfig) {
        var polygon = WE.polygon(polygonCoordinates, {
            color: polygonConfig.borderColor,
            opacity: polygonConfig.borderOpacity,
            weight: polygonConfig.borderWeight,
            fillColor: polygonConfig.fillColor,
            fillOpacity: polygonConfig.fillOpacity
        }).addTo(this.earth);
    };
    MapsBaseOperation3D.prototype.drawPin = function (lat, lng) {
        var marker = WE.marker([lat, lng]).addTo(this.earth);
    };
    return MapsBaseOperation3D;
})();
//polygon.onClick(function(e) {
//	 alert('poly!');
//	});
//setTimeout(function() {
//		//polygon.setFillColor(polygonConfig.fillColor, polygonConfig.fillOpacity);
//		polygon.destroy();
//}, 5000); 
//# sourceMappingURL=MapsBaseOperation3D.js.map