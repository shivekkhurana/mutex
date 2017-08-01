import store from 'mutex/store';

export function fetchCollection() {
  store.mutate(true, ['dogs.fetchingCollection']);
  fetch('https://dog.ceo/api/breeds/list/all')
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      store.mutate(res, ['dogs.collectionFetchSuccess']);
    })
    .catch((err) => {
      store.mutate(err, ['dogs.collectionFetchError']);
    })
  ;
}