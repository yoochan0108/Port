import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const fetchFlickr = async ({ queryKey }) => {
	//쿼리키가 내부적으로 queryKey라는 프로퍼티명으로 담겨있기떄문에 비구조화할당으로 받은다음에
	//해당 배열값의 두번째 옵션값을 옵션으로 전달
	const opt = queryKey[1];
	let url = '';
	const api_key = '2a1a0aebb34012a99c23e13b49175343';
	const method_interest = 'flickr.interestingness.getList';
	const num = 50;
	const method_user = 'flickr.people.getPhotos';
	const method_search = 'flickr.photos.search';

	if (opt.type === 'interest') {
		url = `https://www.flickr.com/services/rest/?method=${method_interest}&api_key=${api_key}&per_page=${num}&nojsoncallback=1&format=json`;
	}
	if (opt.type === 'user') {
		url = `https://www.flickr.com/services/rest/?method=${method_user}&api_key=${api_key}&per_page=${num}&nojsoncallback=1&format=json&user_id=${opt.id}`;
	}
	if (opt.type === 'search') {
		url = `https://www.flickr.com/services/rest/?method=${method_search}&api_key=${api_key}&per_page=${num}&nojsoncallback=1&format=json&tags=${opt.tags}`;
	}
	const result = await axios.get(url);
	return result.data.photos.photo;
};

export const useFlickrQuery = (opt) => {
	//옵션이 들어가는 데이터인 경우에는 옵션에 따라 반환되는 값은 다른데 쿼리키가 동일하면 문제가 발생
	return useQuery(['flickrData', opt], fetchFlickr, {
		refetchOnMount: false,
		refetchOnWindowFocus: false,
		staleTime: 1000 * 60 * 60,
		cacheTime: 1000 * 60 * 60,
	});
};
