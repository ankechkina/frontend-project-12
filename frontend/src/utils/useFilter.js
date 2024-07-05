import filter from 'leo-profanity';

filter.clearList();
filter.add(filter.getDictionary('ru'));
filter.add(filter.getDictionary('en'));

const useFilter = () => filter;

export default useFilter;
