(function() {


    const lat = document.querySelector('#lat').value || 4.5981206;
    const lng = document.querySelector('#lng').value || -74.0760435;
    const mapa = L.map('mapa').setView([lat, lng ], 15);
    let marker;
 
    //Utilizar provider y geocoder  

    const geocoderService = L.esri.Geocoding.geocodeService();
    

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //El pin

    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    //Detectar movimiento del pin    
    marker.on('moveend', function(event){
        marker = event.target

        const posicion = marker.getLatLng();

        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))

        //Obtener informacion de las calles al soltar el pin
        geocoderService.reverse().latlng(posicion, 13).run(function(err, res) {
            console.log(res);

            marker.bindPopup(res.address.LongLabel).openPopup();

            //llenar los campos

            document.querySelector('.calle').textContent = res?.address?.LongLabel ?? '';
            document.querySelector('#calle').value = res?.address?.Address ?? '';
            document.querySelector('#lat').value = res?.latlng?.lat ?? '';
            document.querySelector('#lng').value = res?.latlng?.lng ?? '';
            
        })

    })







})()