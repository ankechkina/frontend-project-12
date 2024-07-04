import filter from 'leo-profanity';

filter.clearList();
filter.add(filter.getDictionary('ru'));

const useFilter = () => filter;

export default useFilter;
