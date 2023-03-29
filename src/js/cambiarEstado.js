(function(){
    const cambiarEstadoBotones = document.querySelectorAll('.cambiar-estado')

    const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

    cambiarEstadoBotones.forEach( boton => {
        boton.addEventListener('click', cambiarEstadoPropiedad)
    })

    async function cambiarEstadoPropiedad(ev) {

        const { propiedadId: id } = ev.target.dataset
        try {
            const url = `/propiedades/${id}`;
            console.log(url);

            const respuesta = await fetch(url, {
                 method: 'PUT',
                 headers: {
                    'csrf-token': token
                 }
            })

            const {resultado} = await respuesta.json();

            if(resultado) {
                if(ev.target.classList.contains('bg-yellow-100')) {
                    ev.target.classList.add('bg-green-100', 'text-green-800')
                    ev.target.classList.remove('bg-yellow-100', 'text-yellow-800')
                    ev.target.textContent = 'Publicado'
                } else {
                    ev.target.classList.remove('bg-green-100', 'text-green-800')
                    ev.target.classList.add('bg-yellow-100', 'text-yellow-800')
                    ev.target.textContent = 'No Publicado'
                }
            }
        } catch (error) {
            console.log(error);
            
        }

    }
})()