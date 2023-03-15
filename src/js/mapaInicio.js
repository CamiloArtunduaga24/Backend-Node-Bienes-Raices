

(function() {
    const lat =  4.5981206;
    const lng = -74.0760435;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 15);

    let markers = new L.FeatureGroup().addTo(mapa)

    let propiedades = [];


    //Filtros
    const filtros = {
        categoria: '',
        precio: ''
    }

    const categoriasSelect = document.querySelector('#categorias')
    const preciosSelect = document.querySelector('#precios')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    //Filtrado de categorias y precios
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = e.target.value
        filtrarPropiedades();
    })

    preciosSelect.addEventListener('change', e => {
        filtros.precio = e.target.value
        filtrarPropiedades();

    })

    const obtenerPropiedades = async () => {
        try {
            const URL = '/api/propiedades'
            const respuesta = await fetch(URL)
            propiedades = await respuesta.json()

            mostrarPropiedades(propiedades)

            // console.log(respuesta);

        } catch (error) {
            console.log(error);
        }
    }

    
    const mostrarPropiedades = propiedades => {
        propiedades.forEach(propiedad => {
            //console.log(propiedad);
            //Agregar Pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p>
                <h1 class="text-xl font-bold uppercase my-2">${propiedad?.titulo}</h1>
                <img width="480" height="300" src="/uploads/${propiedad?.img}" alt="Imagen de la propiedad ${propiedad?.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase"> Ver propiedad </a>
            `)

            markers.addLayer(marker)
        });
    }

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter( filtrarCategoria )

        console.log(resultado);
        
    }

    const filtrarCategoria = (propiedad) => {
        return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad
    }

    obtenerPropiedades()
})()