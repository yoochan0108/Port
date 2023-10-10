import Layout from '../../common/layout/Layout';
import './Gallery.scss';
import { useState, useEffect, useRef } from 'react';
import Masonry from 'react-masonry-component';

export default function Gallery() {
	const refInput = useRef(null);
	const [Pics, setPics] = useState([]);
	const my_id = '199272370@N07';

	const fetchData = async (opt) => {
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

		//만약 특정함수가 promise를 반환한다면 warpping함수로 묶어준뒤 async 지정
		//각각의 promise 반환 함수 앞쪽에 await를 붙이기만 하면 해당 코드는 동기화됨
		//지저분하게 depth를 들여쓰기 해가면서 then구문을 호출할 필요가 없음
		const data = await fetch(url);
		const json = await data.json();
		console.log(json.photos.photo);
		setPics(json.photos.photo);
	};

	useEffect(() => {
		//type: 'interest' 인터레스트 방식 갤러리 호출
		//type: 'user' 사용자 아이디 계정의 갤러리 호출
		//type: 'search'검색키워드로 갤러리 호출
		fetchData({ type: 'user', id: my_id });
		//fetchData({ type: 'interest' });
		//fetchData({ type: 'search', tags: 'ocean' });
	}, []);

	return (
		<Layout title={'Gallery'}>
			<form
				onSubmit={(e) => {
					//submit이벤트의 기본 서버 전송기능을 막아줌
					e.preventDefault();
					//문자열.trim() : 문자열앞뒤로 빈칸을 제거해서 정리
					if (refInput.current.value.trim() === '') {
						return alert('검색어를 입력하세요.');
					}

					fetchData({ type: 'search', tags: refInput.current.value });
					refInput.current.value = '';
				}}
			>
				<input ref={refInput} type='text' placeholder='검색어를 입력하세요' />
				<button>검색</button>
			</form>
			<button onClick={() => fetchData({ type: 'user', id: my_id })}>My Gallery</button>
			<button onClick={() => fetchData({ type: 'interest' })}>Interest Gallery</button>
			<div className='picFrame'>
				<Masonry
					elementType={'div'}
					options={{ transitionDuration: '0.5s' }}
					disableImagesLoaded={false}
					updateOnEachImageLoad={false}
				>
					{Pics.map((data, idx) => {
						return (
							<article key={idx}>
								<div className='inner'>
									<img
										className='pic'
										src={`https://live.staticflickr.com/${data.server}/${data.id}_${data.secret}_m.jpg`}
										alt={`https://live.staticflickr.com/${data.server}/${data.id}_${data.secret}_b.jpg`}
									/>
									<h2>{data.title}</h2>
									<div className='profile'>
										<img
											src={`http://farm${data.farm}.staticflickr.com/${data.server}/buddyicons/${data.owner}.jpg`}
											alt={data.owner}
										/>
										<span onClick={() => fetchData({ type: 'user', id: data.owner })}>
											{data.owner}
										</span>
									</div>
								</div>
							</article>
						);
					})}
				</Masonry>
			</div>
		</Layout>
	);
}
