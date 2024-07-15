import filter from 'leo-profanity';

const initializeProfanityFilter = () => {
  filter.clearList();
  filter.add(filter.getDictionary('ru'));
  filter.add(filter.getDictionary('en'));
};

const useFilter = () => {
  initializeProfanityFilter();
  return filter;
};

export default useFilter;
