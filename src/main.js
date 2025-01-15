import { getImages } from './js/pixabay-api';
import createCardsMarkup from './js/render-functions';
import ButtonService from './js/button';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let galleryLink = new SimpleLightbox('.gallery-link', {
  captionDelay: 250,
  captionsData: 'alt',
});

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMore = document.querySelector('.js-load-more');
const loadMoreBtnService = new ButtonService(loadMore);

const searchForm = document.querySelector('.form');

const params = {
  page: 1,
  perPage: 15,
  maxPage: 1,
  query: '',
};

searchForm.addEventListener('submit', handleSearch);

async function handleSearch(e) {
  e.preventDefault();
  gallery.innerHTML = '';

  loadMoreBtnService.hide();
  params.page = 1;

  const form = e.currentTarget;
  loader.style.display = 'block';

  const userQuery = form.elements.search.value.trim();

  params.query = userQuery;

  try {
    const data = await getImages(params);

    if (data.total === 0) {
      iziToast.error({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
    }
    params.maxPage = Math.ceil(data.totalHits / params.perPage);
    gallery.innerHTML = createCardsMarkup(data.hits);
    galleryLink.refresh();

    if (params.maxPage > params.page) {
      loadMoreBtnService.show();

      loadMore.addEventListener('click', handlePagination);
    }
  } catch (err) {
    console.error(err);
  } finally {
    loader.style.display = 'none';
    form.reset();
  }
}

async function handlePagination(e) {
  loadMoreBtnService.setLoading();
  params.page += 1;
  loader.style.display = 'block';

  try {
    const data = await getImages(params);

    const photosMarkup = createCardsMarkup(data.hits);

    gallery.insertAdjacentHTML('beforeend', photosMarkup);
    galleryLink.refresh();

    let elem = document.querySelector('.gallery-item');
    let rect = elem.getBoundingClientRect();
    for (const key in rect) {
      if (typeof rect[key] !== 'function') {
        window.scrollBy({
          top: 2 * rect.height,
          behavior: 'smooth',
        });
      }
    }

    loadMoreBtnService.setNormal();

    if (params.maxPage === params.page) {
      loadMoreBtnService.hide();
      loadMore.removeEventListener('click', handlePagination);
      iziToast.success({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        color: 'blue',
        icon: false,
      });
    }
  } catch (err) {
    console.log(err);
  } finally {
    loader.style.display = 'none';
  }
}