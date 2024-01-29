import { InfoAPI,Info,Episode,Character } from "./interfaces";

const urlEpisodes = 'https://rickandmortyapi.com/api/episode';

// SIDEBAR VARIABLES
const episodesList = document.getElementById('episodeList') as HTMLUListElement;
const nextBtn = document.getElementById('loadMoreEpisodes') as HTMLButtonElement;

// CALLING API
printTitle(urlEpisodes);

async function printTitle(url: string) {
    const data = await fetch(url);
    const JSONdata: InfoAPI = await data.json(); 
    const episodes: Episode[] = JSONdata.results;
  
    // RENDERING EPISODES LIST  
    episodes.forEach((episode) => {
      episodesList.insertAdjacentHTML('beforeend', `<li id='${episode.episode}' elementURL='${episode.url}'> Episode ${episode.id}</li>`);
      const clickEpisode = document.getElementById(`${episode.episode}`) as HTMLLIElement;
      clickEpisode.addEventListener('click', printInfoEpi);
    });
  
    // SHOW MORE EPISODES BUTTON
    if (JSONdata.info.next) {
      nextBtn.addEventListener(
        'click',
        () => {
          printTitle(JSONdata.info.next);
        },
        { once: true }
      );
    } else {
      nextBtn.remove();
    }
}

// RENDERING EPISODES & CHARACTERS INFO
async function printInfoEpi(click: MouseEvent) {
    try {
        const target = click.target as HTMLLIElement;
        const urlEpisode = target.getAttribute("elementURL");
    
        if (!urlEpisode) {
            console.error("Episode URL was not found");
            return;
        }
    
        const [episodeInfo, characters] = await Promise.all([
            fetchEpisodeInfo(urlEpisode),
            fetchCharactersInfo(urlEpisode),
        ]);
    
        renderEpisodeInfo(episodeInfo);
        renderCharacterList(characters);

        const welcome = document.getElementById("welcome");
        welcome?.classList.add("hide");
    } catch (error) {
        console.error("Error uploading info:", error);
    }
}

async function fetchEpisodeInfo(url: string): Promise<Episode> {
    const response = await fetch(url);

    if (!response) {
        throw new Error(`Error obtaining episode data: ${response}`);
    }

    return response.json();
}

async function fetchCharactersInfo(url: string): Promise<Character[]> {
    const response = await fetch(url);

    if (!response) {
        throw new Error(`Error obtaining characters data: ${response}`);
    }

    const episodeInfo: Episode = await response.json();
    const charactersPromises = episodeInfo.characters.map(url => fetch(url).then(response => response.json()));
    return Promise.all(charactersPromises);
}

function renderEpisodeInfo(episodeInfo: Episode): void {
    const displayEpisodeInfo = `
        <div class="episode-info">
        <h1>${episodeInfo.name}</h1>
        <p>${episodeInfo.air_date}</p>
        <p>${episodeInfo.episode}</p>
        </div>
    `;

    const renderEpisodeInfo = document.getElementById("episodesContainerInfo") as HTMLDivElement;
    renderEpisodeInfo.innerHTML = displayEpisodeInfo;
}

// fuction that creates a div with the image and character info. the div has the class "character-info"

function renderCharacterList(characters: Character[]): void {
    const renderCharacterCard = document.getElementById("characterList") as HTMLDivElement;
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
