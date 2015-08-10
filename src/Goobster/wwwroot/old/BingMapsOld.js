

         

          function getMap() {
          	var mapElement = document.getElementById('myMap');
          	$scope.map = new Microsoft.Maps.Map(mapElement,
						{
							credentials: 'AvG4Dt4pLG4zk0EPsx7KoSaXF4gdjGB3ZDgH0h9orBMMi2ZXswfG4ZvMmvkkrjB1',
							center: new Microsoft.Maps.Location(50.09365233591469, 8.683291678638852),
							zoom: 13
						});
          }
		
          

          var virtualPath = "http://localhost:4416/";

          function addPushpin(imageName, latitude, longitude) {
          	var pushpinOptions = {};
          	if (imageName) {
          		pushpinOptions.icon = virtualPath + '/Images/' + imageName;
          		pushpinOptions.width = 32;
          		pushpinOptions.height = 32;
          	}

          	var location = { latitude: latitude, longitude: longitude };
          	var pushpin = new Microsoft.Maps.Pushpin(location, pushpinOptions);
          	$scope.map.entities.push(pushpin);
          }



          $scope.addCustomPolygon = function () {
          	latlon = $scope.map.getCenter();
          	var thickness = Math.round(5 * Math.random() + 1);
          	var options = { fillColor: new Microsoft.Maps.Color(Math.round(255 * Math.random()), Math.round(255 * Math.random()), Math.round(255 * Math.random()), Math.round(255 * Math.random())), strokeColor: new Microsoft.Maps.Color(Math.round(255 * Math.random()), Math.round(255 * Math.random()), Math.round(255 * Math.random()), Math.round(255 * Math.random())), strokeThickness: parseInt(thickness) };
          	var polygon = new Microsoft.Maps.Polygon([new Microsoft.Maps.Location(latlon.latitude, latlon.longitude - 0.15), new Microsoft.Maps.Location(latlon.latitude + 0.1, latlon.longitude - 0.05), new Microsoft.Maps.Location(latlon.latitude + 0.1, latlon.longitude + 0.05), new Microsoft.Maps.Location(latlon.latitude, latlon.longitude + 0.15), new Microsoft.Maps.Location(latlon.latitude - 0.1, latlon.longitude + 0.05), new Microsoft.Maps.Location(latlon.latitude - 0.1, latlon.longitude - 0.05), new Microsoft.Maps.Location(latlon.latitude, latlon.longitude - 0.15)], options);
          	$scope.map.setView({ zoom: 10 });
          	$scope.map.entities.push(polygon);
          }


