        // initialize the map
        var map = L.map('map').setView([54.548698,10.769660], 10);

        // load a tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            {
                attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
                maxZoom: 21,
                minZoom: 4
            }).addTo(map);



        // Read markers data from data.csv
        $.get('./data/data.csv', function (csvString) {

            // Use PapaParse to convert string to array of objects
            var data = Papa.parse(csvString, { header: true, dynamicTyping: true }).data;

            // For each row in data, create a marker and add it to the map
            // For each row, columns `Latitude`, `Longitude`, and `Time` are required
            for (var i in data) {
                var row = data[i];
                if (i % 10 == 0){
                //for markers instead of lines
                /*
                var marker = L.marker([row.Latitude, row.Longitude], {
                    opacity: 1
                }).bindPopup(row.Time);

                marker.addTo(map);
                */
               
                if (i>9){
                var pointA = new L.LatLng(row.Latitude, row.Longitude);
                var pointB = new L.LatLng(data[i-10].Latitude,data[i-10].Longitude);
                var pointList = [pointA, pointB];
                var line = new L.Polyline(pointList).bindPopup(row.Time);
                line.addTo(map);
                
                }
                }
                //console.log(data[i])
            }

        });