document.addEventListener("DOMContentLoaded", async () => {
    const div = createContainer();
    const peliculas = await fetchMovies();
    const addFavorite = JSON.parse(localStorage.getItem("addFavorite") || "{}");
    const data = peliculas.data;
    const moviesFound = data.filter((movie) => addFavorite[movie.id]);

    if (moviesFound.length > 0) {
        moviesFound.forEach((movie) => {
            const card = createMovieCard(movie, addFavorite);
            div.appendChild(card);
        });
    } else {
        const notFavorites = document.createElement("h2");
        notFavorites.innerText =
            "No agregaste ninguna película a favoritos";
        div.appendChild(notFavorites);
    }
});

async function fetchMovies() {
    try {
        const response = await fetch("http://localhost:3000/api/movies");
        return await response.json();
    } catch (error) {
        console.log("Error: ", error);
    }
}

function createContainer() {
    const app = document.getElementById("root");
    const div = document.createElement("div");
    div.classList.add("div");
    app.appendChild(div);
    return div;
}

function createMovieCard(movie, addFavorite) {
    const card = document.createElement("div");
    card.style.cursor = "pointer";
    card.classList.add("card");
    const detailEdit = document.createElement("a");
    detailEdit.setAttribute("href", `formulario.html?=${movie.id}`);
    detailEdit.textContent = "Movie Details";
    card.addEventListener("click", () => {
        window.location.href = detailEdit;
    });
    
    const h1 = document.createElement("h1");
    h1.textContent = movie.title;
    
    const p = document.createElement("p");
    p.textContent = `Rating: ${movie.rating}`;
    
    const duracion = document.createElement("p");
    duracion.textContent = `Duracion: ${movie.length}`;
    
    const iconFavorites = iconStar(movie.id, addFavorite);
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

function iconStar(movies, addFavorite) {
    const iconFavorites = document.createElement("i");
    iconFavorites.id = movies;
    iconFavorites.classList.add("fa-star", "far");

    if (addFavorite[movies]) {
        iconFavorites.classList.remove("far");
        iconFavorites.classList.add("fas");
        iconFavorites.style.color = "red";
    }

    iconFavorites.addEventListener("click", (event) => {
        event.stopPropagation();
        event.preventDefault();

        if (addFavorite[movies]) {
            delete addFavorite[movies];
            iconFavorites.classList.remove("fas");
            iconFavorites.classList.add("far");
            iconFavorites.style.color = "";
        } else {
            addFavorite[movies] = true;
            iconFavorites.classList.remove("far");
            iconFavorites.classList.add("fas");
            iconFavorites.style.color = "red";
        }
        localStorage.setItem("addFavorite", JSON.stringify(addFavorite));
    });
    return iconFavorites;
}
