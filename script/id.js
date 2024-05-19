'use strict';

import musicService from"./music-group-service.js";

(async () => {
    //hämtar alla IDs från detaljvyn
    const _service = new musicService(`https://appmusicwebapinet8.azurewebsites.net/api`);
    const grpName = document.querySelector("#groupName");
    const genre = document.querySelector("#genre");
    const year = document.querySelector("#established");
    const artistGroup = document.querySelector("#artist-name");
    const albumGroup = document.querySelector("#album-name");

    //hämtar ID:n på musikgruppen som skickades med till sidan.
    let url = new URL(window.location);
    let params = url.searchParams;
    let id = params.get("id");

    //hämtar info om den specifika gruppen från ID:et
    let musicGroup = await _service.readMusicGroupAsync(id, false);

    //ritar upp sidan med informationen.
    grpName.value = musicGroup.name;
    genre.value = musicGroup.strGenre;
    year.value = musicGroup.establishedYear;

    const pageArtist = musicGroup.artists;
    const pageAlbum = musicGroup.albums;

   
    for (const a of pageArtist) {
        const artist = document.createElement("div");

        artist.className = "col-md-12 themed-grid-col";
        artist.innerText = `${a.firstName} ${a.lastName}`;
        artistGroup.appendChild(artist);
    }

    for (const a of pageAlbum) {
        const albumName = document.createElement("div");
        const albumYear = document.createElement("div");
        
        albumName.className = "col-md-10 themed-grid-col";
        albumName.innerText = a.name;

        albumYear.className = "col-md-2 themed-grid-col";
        albumYear.innerText = a.releaseYear;

        albumGroup.appendChild(albumName);
        albumGroup.appendChild(albumYear);
    }
    
  })();