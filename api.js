const publicKey = 'a65fa5a2f0b87c8a34f4cbb22ae302ab';
const privateKey = '8d61b89ed047bf11c8364d0b26593e8f67bf9648';


async function fetchMarvelCharacters(characterName, limit = 20, offset = 0) {
  const ts = new Date().getTime();
  const hash = md5(ts + privateKey + publicKey);

  const apiUrl = `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${encodeURIComponent(characterName)}&ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=${limit}&offset=${offset}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Network response was not ok.');
    }
    const data = await response.json();
    return data.data.results;
  } catch (error) {
    console.error('Error fetching Marvel characters:', error);
    return []; 
  }
}


function renderCharacters(characters) {
  const charactersContainer = document.getElementById('characters');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');

  charactersContainer.innerHTML = '';

  characters.forEach(character => {
    const characterElement = document.createElement('div');
    characterElement.classList.add('character');

    const characterName = document.createElement('h2');
    characterName.textContent = character.name;

    const characterDescription = document.createElement('p');
    characterDescription.textContent = character.description || 'No description available.';

    const characterImage = document.createElement('img');
    characterImage.src = `${character.thumbnail.path}.${character.thumbnail.extension}`;

    characterElement.appendChild(characterName);
    characterElement.appendChild(characterDescription);
    characterElement.appendChild(characterImage);

    charactersContainer.appendChild(characterElement);
  });


  async function performSearch() {
    const searchTerm = searchInput.value.toLowerCase();
    const characters = await fetchMarvelCharacters(searchTerm);
    renderCharacters(characters);
  }


  searchButton.addEventListener('click', performSearch);
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  });
}


renderCharacters([]); 