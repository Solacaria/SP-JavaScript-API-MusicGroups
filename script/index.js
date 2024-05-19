'use strict';  

import musicService from"./music-group-service.js";

(async () => {

    const _service = new musicService(`https://appmusicwebapinet8.azurewebsites.net/api`);
    const listItem = document.getElementById("display-music-groups");
    const btnNext = document.querySelector('#btnNext');
    const btnPrev = document.querySelector('#btnPrev');
    const myForm = document.querySelector("#search-form");
    

    btnNext.addEventListener('click', clickNext);
    btnPrev.addEventListener('click', clickPrev);
    myForm.addEventListener('submit', searchHandler);

    
    let musicListCount;
    let musicListFull;

    musicListFull = await checkSearch();

    let currentPage = 0;
    const pageSize = 10;
    const maxNrPages = Math.ceil(musicListFull.dbItemsCount/pageSize);
  

    removeAllChildNodes(listItem);
    renderDefaultMusicGroups(0);

    async function renderDefaultMusicGroups(rPage) {
        //renderar sidan med grupperna och visar antalet grupper som hittades.

        const nrGrps = document.querySelector("#number-of-groups");
        nrGrps.innerText = `Antalet grupper som hittades: ${musicListFull.dbItemsCount}`;

        const pageData = musicListFull.pageItems.slice(pageSize*rPage, pageSize*rPage+pageSize);

        for (const item of pageData) {

            if (item.artists !== 0 && item.name !== null) {
                const newMusicGroup = document.createElement("div");
                const musicGroupAnchor = document.createElement("a");
                
                newMusicGroup.appendChild(musicGroupAnchor);
                musicGroupAnchor.href = `./specific-page.html?id=${item.musicGroupId}`;
                musicGroupAnchor.innerText = `Group: ${item.name} \n Member(s): ${getNames(item)}`;

                newMusicGroup.className = "col-md-10 themed-grid-col";

                listItem.appendChild(newMusicGroup);
            }
        }
    }

    async function checkSearch(input) {
        //Kollar ifall det finns en input (sök-string) eller inte, och hämtar info beroende på resultat.
        if (input === undefined || input === ''){
            musicListCount = await _service.readMusicGroupsAsync(0);
            const nrItems = musicListCount.dbItemsCount;
            musicListFull = await _service.readMusicGroupsAsync(0, false, null, nrItems);
            return musicListFull;
        }
        else {
            musicListCount = await _service.readMusicGroupsAsync(0, false, input);
            const nrItems = musicListCount.dbItemsCount;
            musicListFull = await _service.readMusicGroupsAsync(0, false, input, nrItems);
            return musicListFull;
        }
    }
    
    async function searchHandler(e){
        //Hämtar info från sökning, uppdaterar listan och gör en ny rendering.
        e.preventDefault();
        const formData = new FormData(myForm);
        const search = formData.get("user-input-text");
        
        musicListFull = await checkSearch(search);
        removeAllChildNodes(listItem);
        renderDefaultMusicGroups(0);
    }
    //#region Misc functions
    function removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }
    function clickNext (event)  {
        currentPage++;
        if (currentPage > maxNrPages-1) currentPage = maxNrPages-1;
    
        removeAllChildNodes(listItem);
        renderDefaultMusicGroups(currentPage)
    };
    function clickPrev (event)  {
        currentPage--;
        if (currentPage < 0) currentPage = 0;
    
        removeAllChildNodes(listItem);
        renderDefaultMusicGroups(currentPage)
    };
    
    function getNames (item) {
        let name = "";
        let length = item.artists.length;

        for (let i = 0; i < length; i++) {
            name += item.artists[i].firstName +  " " + item.artists[i].lastName + ", ";
        }

        name = name.trimEnd().replace(/,+$/, '');
        return name;
    }
    //#endregion
  })();

