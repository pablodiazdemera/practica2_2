import { createClient } from '@supabase/supabase-js'
import { createClient } from '@supabase/supabase-js'
 
 //supabase credencial
    const supabase = supabase.createClient("https://smtdbelepgdtzipjiiqq.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdGRiZWxlcGdkdHppcGppaXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyNjg3NzcsImV4cCI6MjAxNjg0NDc3N30.tk4xCGR-brcjXzM4xebrm3Wt8XeN7bZ-ljriZq3_M98");
    //supabase credencial

//proyect apikey

const API_KEY = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';



const supabase = createClient("https://smtdbelepgdtzipjiiqq.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdGRiZWxlcGdkdHppcGppaXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDEyNjg3NzcsImV4cCI6MjAxNjg0NDc3N30.tk4xCGR-brcjXzM4xebrm3Wt8XeN7bZ-ljriZq3_M98");

const fetchPeliculas = async () => {
    const { data, error } = await supabase.from('peliculas').select('*');
    if (error) {
        console.error(error);
        return [];
    }
    return data;
};

const guardarPeliculas = async (peliculas) => {
    const { data, error } = await supabase.from('peliculas').upsert(peliculas);
    if (error) {
        console.error(error);
        return false;
    }
    return true;
};

let mis_peliculas_iniciales = [
    {titulo: "Interstellar",  director: "Christopher Nolan", "miniatura": "files/interstellar.png"},
    {titulo: "Jurassic Park", director: "Steven Spielberg", "miniatura": "files/jurassicpark.png"},
    {titulo: "Superlópez",   director: "Javier Ruiz Caldera", "miniatura": "files/superlopez.png"}
];

const cargarPeliculas = async () => {
    const peliculas = await fetchPeliculas();
    if (peliculas.length === 0) {
        await guardarPeliculas(mis_peliculas_iniciales);
        return mis_peliculas_iniciales;
    }
    return peliculas;
};

let peliculas = await cargarPeliculas();

// VISTAS
const indexView = (peliculas) => {
    let i=0;
    let view = "";

    while(i < peliculas.length) {
      view += `
        <div class="movie">
           <div class="movie-img">
                <img data-my-id="${i}" src="${peliculas[i].miniatura}" onerror="this.src='files/placeholder.png'"/>
           </div>
           <div class="title">
               ${peliculas[i].titulo || "<em>Sin título</em>"}
           </div>
           <div class="actions">
               <button class="edit" data-my-id="${i}">editar</button>
               <button class="delete" data-my-id="${i}">borrar</button>
               <button class="show" data-my-id="${i}">ver</button>
            </div>
        </div>\n`;
      i = i + 1;
    };

    view += `<div class="actions">
                <button class="new">añadir</button>
                <button class="reset">reset</button>
            </div>`;

    return view;
};

const editView = (i, pelicula) => {
    return `<h2>Editar Película </h2>
        <div class="field">
        Título <br>
        <input  type="text" id="titulo" placeholder="Título" 
                value="${pelicula.titulo}">
        </div>
        <div class="field">
        Director <br>
        <input  type="text" id="director" placeholder="Director" 
                value="${pelicula.director}">
        </div>
        <div class="field">
        Miniatura <br>
        <input  type="text" id="miniatura" placeholder="URL de la miniatura" 
                value="${pelicula.miniatura}">
        </div>
        <div class="actions">
            <button class="update" data-my-id="${i}">
                Actualizar
            </button>
            <button class="index">
                Volver
            </button>
       `;
}

const showView = (pelicula) => {
    return `
     <h2>${pelicula.titulo}</h2>
     <p>Director: ${pelicula.director}</p>
     <div class="movie-img">
        <img src="${pelicula.miniatura}" onerror="this.src='files/placeholder.png'"/>
     </div>
     <div class="actions">
        <button class="index">Volver</button>
     </div>`;
}

const newView = () => {
    return `<h2>Crear Película</h2>
        <div class="field">
        Título <br>
        <input  type="text" id="titulo" placeholder="Título">
        </div>
        <div class="field">
        Director <br>
        <input  type="text" id="director" placeholder="Director">
        </div>
        <div class="field">
        Miniatura <br>
        <input  type="text" id="miniatura" placeholder="URL de la miniatura">
        </div>
        <div class="actions">
            <button class="create">
                Crear
            </button>
            <button class="index">
                Volver
            </button>
        </div>`;
}

// CONTROLADORES 
const indexContr = () => {
    let mis_peliculas = JSON.parse(localStorage.mis_peliculas);
    document.getElementById('main').innerHTML = indexView(mis_peliculas);
};

const showContr = (i) => {
    let mis_peliculas = JSON.parse(localStorage.mis_peliculas);
    document.getElementById('main').innerHTML = showView(mis_peliculas[i]);
};

const newContr = () => {
    document.getElementById('main').innerHTML = newView();
};

const createContr = () => {
    let nuevaPelicula = {
        titulo: document.getElementById('titulo').value,
        director: document.getElementById('director').value,
        miniatura: document.getElementById('miniatura').value
    };
    let mis_peliculas = JSON.parse(localStorage.mis_peliculas);
    mis_peliculas.push(nuevaPelicula);
    localStorage.mis_peliculas = JSON.stringify(mis_peliculas);
    indexContr();
};

const editContr = (i) => {
    let pelicula = JSON.parse(localStorage.mis_peliculas)[i];
    document.getElementById('main').innerHTML = editView(i, pelicula);
};

const updateContr = (i) => {
    let mis_peliculas = JSON.parse(localStorage.mis_peliculas);
    mis_peliculas[i].titulo    = document.getElementById('titulo').value;
    mis_peliculas[i].director  = document.getElementById('director').value;
    mis_peliculas[i].miniatura = document.getElementById('miniatura').value;
    localStorage.mis_peliculas = JSON.stringify(mis_peliculas);
    indexContr();
};

const deleteContr = (i) => {
    let confirmacion = confirm("¿Estás seguro de que quieres eliminar esta película?");
    if (confirmacion) {
        let mis_peliculas = JSON.parse(localStorage.mis_peliculas);
        mis_peliculas.splice(i, 1);
        localStorage.mis_peliculas = JSON.stringify(mis_peliculas);
        indexContr();
    }
};

const resetContr = () => {
    let confirmacion = confirm("¿Estás seguro de que quieres restaurar las películas originales?");
    if (confirmacion) {
        localStorage.mis_peliculas = JSON.stringify(mis_peliculas_iniciales);
        indexContr();
    }
};

// ROUTER de eventos
const matchEvent = (ev, sel) => ev.target.matches(sel);
const myId = (ev) => Number(ev.target.dataset.myId);

document.addEventListener('click', ev => {
    if      (matchEvent(ev, '.index'))  indexContr  ();
    else if (matchEvent(ev, '.edit'))   editContr   (myId(ev));
    else if (matchEvent(ev, '.update')) updateContr (myId(ev));
    else if (matchEvent(ev, '.delete')) deleteContr (myId(ev));
    else if (matchEvent(ev, '.reset'))  resetContr  ();
    else if (matchEvent(ev, '.show'))   showContr   (myId(ev));
    else if (matchEvent(ev, '.new'))    newContr    ();
    else if (matchEvent(ev, '.create')) createContr ();
})

// Inicialización        
document.addEventListener('DOMContentLoaded', indexContr);

const container = document.getElementById('smtdbelepgdtzipjiiqq'); // Reemplaza 'container' con el ID de tu contenedor HTML

data.forEach(item => {
  const elementoHTML = `
    <div>
      <h2>${item.titulo}</h2>
      <p>Director: ${item.director}</p>
      <img src="${item.miniatura}" alt="Miniatura">
    </div>
  `;
  container.innerHTML += elementoHTML;
});
