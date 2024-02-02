$(document).ready(function() {
  const apiKey = 'aebcbfe28ff55b94ad2a40485d283163';

  // Função para traduzir descrições automaticamente
  async function translateDescription(description, targetLanguage) {
    const translateApiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURI(description)}`;

    try {
      const response = await fetch(translateApiUrl);
      const data = await response.json();
      const translatedText = data[0][0][0];
      return translatedText;
    } catch (error) {
      console.error('Erro ao traduzir descrição:', error);
      return description; // Retorna a descrição original em caso de erro na tradução
    }
  }

  function searchMovies() {
    const searchTerm = $('#searchInput').val();
    const apiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}`;

    $.get(apiUrl, async function (data) {
      const moviesList = $('#moviesList');
      moviesList.empty();

      for (const movie of data.results) {
        const imageUrl = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
        const originalDescription = movie.overview;

        // Traduzir automaticamente a descrição para o português (pt-BR)
        const translatedDescription = await translateDescription(originalDescription, 'pt-BR');

        const movieHtml = `
          <div class="movie-card" onclick="openImage('${imageUrl}')">
            <img src="${imageUrl}" alt="${movie.title}">
            <div class="movie-details">
              <h3>${movie.title}</h3>
              <p>${translatedDescription}</p>
            </div>
          </div>
        `;
        moviesList.append(movieHtml);
      }
    }).fail(function() {
      console.error('Erro ao buscar filmes. Certifique-se de que sua chave de API está correta e que a solicitação à API está sendo permitida.');
    });
  }

  $('#searchButton').on('click', searchMovies);
});

function createWatchButton(title, link) {
  return `
    <a href="${link}" target="_blank">
      <button class="watch-button">${title}</button>
    </a>
  `;
}

async function displayMovies(movies) {
  const moviesList = $('#moviesList');
  moviesList.empty();

  for (const movie of movies) {
    const imageUrl = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;
    const originalDescription = movie.overview;

    // Traduzir automaticamente a descrição para o português (pt-BR)
    const translatedDescription = await translateDescription(originalDescription, 'pt-BR');

    const watchButton = createWatchButton('Assistir Agora', '#'); // Substitua '#' pelo link apropriado

    const movieHtml = `
      <div class="movie-card">
        <img src="${imageUrl}" alt="${movie.title}">
        <div class="movie-details">
          <h3>${movie.title}</h3>
          <p>${translatedDescription}</p>
          ${watchButton}
        </div>
      </div>
    `;
    moviesList.append(movieHtml);
  }
}

function openImage(imageUrl) {
  const overlay = $('<div id="image-overlay">');
  overlay.css({
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  });

  const image = $('<img>');
  image.attr('src', imageUrl);
  image.css({
    maxWidth: '80%',
    maxHeight: '80%',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
  });

  overlay.append(image);
  overlay.on('click', function() {
    overlay.remove();
  });

  $('body').append(overlay);
}