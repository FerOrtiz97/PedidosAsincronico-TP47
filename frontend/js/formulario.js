window.onload = () => {
    const url = 'http://localhost:3000/api/movies/';
    const query = new URLSearchParams(location.search);
    console.log("VARIABLE QUERY", query);

    if (query.has('id')) {
        controlMovie(url, query);
    } else {
        newMovie(url);
    }
};

function controlMovie(url, query) {
    let idPelicula = query.get('id');
    console.log("IDPELICULA", idPelicula);
    document.querySelector("#crearPelicula").style.display = "none";

    fetch(url + idPelicula)
        .then(resp => resp.json())
        .then(movie => formData(movie));

    document.getElementById("editarPelicula").addEventListener("click", e => updateMovie(e, url, idPelicula));
    document.getElementById("borrarPelicula").addEventListener("click", e => deleteMovie(e, url, idPelicula));
}

function newMovie(url) {
    document.querySelector("#editarPelicula").style.display = "none";
    document.querySelector("#borrarPelicula").style.display = "none";
    document.getElementById("crearPelicula").addEventListener("click", e => createMovie(e, url));
}

function formData(movie) {
    document.getElementById('title').value = movie.data.title;
    document.getElementById('rating').value = parseFloat(movie.data.rating);
    document.getElementById('awards').value = parseInt(movie.data.awards);
    const releaseDate = new Date(movie.data.release_date);
    const formattedReleaseDate = releaseDate.toISOString().split('T')[0];
    document.getElementById('release_date').value = formattedReleaseDate;
    document.getElementById('length').value = parseInt(movie.data.length);
}

function updateMovie(e, url, idPelicula) {
    e.preventDefault();
    let formData = getFormData();
    fetch(`${url}update/${idPelicula}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(resp => resp.json())
        .then(respuesta => {
            console.log(respuesta);
            alert('Película actualizada correctamente');
        });
}

function deleteMovie(e, url, idPelicula) {
    e.preventDefault();
    if (confirm('¿Está seguro de que desea borrar esta película?')) {
        fetch(`${url}delete/${idPelicula}`, { method: "DELETE" })
            .then(resp => resp.json())
            .then(respuesta => {
                console.log(respuesta);
                alert('Película eliminada correctamente');
            });
    }
}

function createMovie(e, url) {
    e.preventDefault();
    let formData = getFormData();
    formData.genre_id = 5;
    fetch(`${url}create`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(resp => resp.json())
        .then(respuesta => {
            console.log(respuesta);
            alert('Película creada correctamente');
        });
}

function getFormData() {
    return {
        title: document.getElementById("title").value,
        rating: document.getElementById("rating").value,
        awards: document.getElementById("awards").value,
        release_date: document.getElementById("release_date").value,
        length: document.getElementById("length").value
    };
}
