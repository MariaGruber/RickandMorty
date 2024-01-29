var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const urlEpisodes = 'https://rickandmortyapi.com/api/episode';
const episodesList = document.getElementById('episodeList');
const nextBtn = document.getElementById('loadMoreEpisodes');
printTitle(urlEpisodes);
function printTitle(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield fetch(url);
        const JSONdata = yield data.json();
        const episodes = JSONdata.results;
        episodes.forEach((episode) => {
            episodesList.insertAdjacentHTML('beforeend', `<li id='${episode.episode}' elementURL='${episode.url}'> Episode ${episode.id}</li>`);
            const clickEpisode = document.getElementById(`${episode.episode}`);
            clickEpisode.addEventListener('click', printInfoEpi);
        });
        if (JSONdata.info.next) {
            nextBtn.addEventListener('click', () => {
                printTitle(JSONdata.info.next);
            }, { once: true });
        }
        else {
            nextBtn.remove();
        }
    });
}
function printInfoEpi(click) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const target = click.target;
            const urlEpisode = target.getAttribute("elementURL");
            if (!urlEpisode) {
                console.error("Episode URL was not found");
                return;
            }
            const [episodeInfo, characters] = yield Promise.all([
                fetchEpisodeInfo(urlEpisode),
                fetchCharactersInfo(urlEpisode),
            ]);
            renderEpisodeInfo(episodeInfo);
            renderCharacterList(characters);
            const welcome = document.getElementById("welcome");
            welcome === null || welcome === void 0 ? void 0 : welcome.classList.add("hide");
        }
        catch (error) {
            console.error("Error uploading info:", error);
        }
    });
}
function fetchEpisodeInfo(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (!response) {
            throw new Error(`Error obtaining episode data: ${response}`);
        }
        return response.json();
    });
}
function fetchCharactersInfo(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(url);
        if (!response) {
            throw new Error(`Error obtaining characters data: ${response}`);
        }
        const episodeInfo = yield response.json();
        const charactersPromises = episodeInfo.characters.map(url => fetch(url).then(response => response.json()));
        return Promise.all(charactersPromises);
    });
}
function renderEpisodeInfo(episodeInfo) {
    const displayEpisodeInfo = `
        <div class="episode-info">
        <h1>${episodeInfo.name}</h1>
        <p>${episodeInfo.air_date}</p>
        <p>${episodeInfo.episode}</p>
        </div>
    `;
    const renderEpisodeInfo = document.getElementById("episodesContainerInfo");
    renderEpisodeInfo.innerHTML = displayEpisodeInfo;
}
function renderCharacterList(characters) {
    const renderCharacterCard = document.getElementById("characterList");
    renderCharacterCard.innerHTML = "";
    characters.forEach(characterInfo => {
        const renderCharacterInfo = `
        <div class="character-info">
            <img src=${characterInfo.image} alt=${characterInfo.name}/>
            <h3>${characterInfo.name}</h3>
            <span>${characterInfo.status}</span>
            <span>${characterInfo.species}</span>
            <p>${characterInfo.gender}</p>
        </div>
        `;
        renderCharacterCard.insertAdjacentHTML("beforeend", renderCharacterInfo);
    });
}
export {};
//# sourceMappingURL=index.js.map