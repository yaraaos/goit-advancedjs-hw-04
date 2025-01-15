function createCardsMarkup(cards) {
    return cards
      .map(
        ({
          webformatURL,
          largeImageURL,
          tags,
          likes,
          views,
          comments,
          downloads,
        }) => {
          return `<li class='gallery-item'>
          <a class="gallery-link" href="${largeImageURL}" >
          <img
              class="gallery-image"
              src="${webformatURL}"
              alt="${tags}"
              width='358'
              height='200'
              />
      </a>
      <ul class='img-info'>
      <li><p>Likes</p><p>${likes}</p></li>
      <li><p>Views</p><p>${views}</p></li>
      <li><p>Comments</p><p>${comments}</p></li>
      <li><p>Downloads</p><p>${downloads}</p></li>
      </ul>
  </li>`;
        }
      )
      .join('');
  }
  
  export default createCardsMarkup;