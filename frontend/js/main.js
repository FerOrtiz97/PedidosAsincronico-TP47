window.onload = async () => {
    const container = document.querySelector(".container");

    try {
        const response = await fetch("http://localhost:3000/api/movies");
        const movies = await response.json();
        let data = movies.data;
        let addFavorite = getFavoriteMovies();

        data.forEach((movie) => {
            const card = createMovieCard(movie, addFavorite);
            container.appendChild(card);
        });
    } catch (err) {
        console.log("Err ", err);
    }
};

function getFavoriteMovies() {
    let addFavorite = localStorage.getItem("addFavorite");
    return addFavorite ? JSON.parse(addFavorite) : {};
}

function createMovieCard(movie, addFavorite) {
    const card = document.createElement("div");
    card.style.cursor = "pointer";
    card.setAttribute("class", "card");

    const detailEdit = document.createElement("a");
    detailEdit.setAttribute("href", `formulario.html?id=${movie.id}`);
    detailEdit.textContent = "Movie Details";

    card.addEventListener("click", () => {
        window.location.href = detailEdit.href;
    });

    const h1 = document.createElement("h1");
    h1.textContent = movie.title;

    const iconFavorites = iconStar(movie.id, addFavorite);
    const p = document.createElement("p");
    p.textContent = `Rating: ${movie.rating}`;

    const duracion = document.createElement("p");
    duracion.textContent = `Duracion: ${movie.length}`;

    card.appendChild(iconFavorites);
    card.appendChild(h1);
    card.appendChild(p);

    if (movie.genre !== null) {
        const genero = document.createElement("p");
        genero.textContent = `Genero: ${movie.genre.name}`;
        card.appendChild(genero);
    }
    card.appendChild(duracion);
    return card;
}

function iconStar(movieId, addFavorite) {
    const iconFavorites = document.createElement("i");
    iconFavorites.id = movieId;
    iconFavorites.classList.add("fa-star");
    iconFavorites.classList.add("far");

    if (addFavorite[movieId]) {
        iconFavorites.classList.remove("far");
        iconFavorites.classList.add("fas");
        iconFavorites.style.color = "red";
    }

    iconFavorites.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (addFavorite[movieId]) {
            delete addFavorite[movieId];
            iconFavorites.classList.remove("fas");
            iconFavorites.classList.add("far");
            iconFavorites.style.color = "";
        } else {
            addFavorite[movieId] = true;
            iconFavorites.classList.remove("far");
            iconFavorites.classList.add("fas");
            iconFavorites.style.color = "red";
        }
        localStorage.setItem("addFavorite", JSON.stringify(addFavorite));
    });
    return iconFavorites;
}
