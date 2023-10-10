import Layout from '../../common/layout/Layout';
import './Gallery.scss';
import { useState, useEffect, useRef } from 'react';
import Masonry from 'react-masonry-component';

export default function Gallery() {
	const refFrame = useRef(null);
	const refInput = useRef(null);
	const refBtnSet = useRef(null);
	const [Pics, setPics] = useState([]);
	const [Loader, setLoader] = useState(true);
	//대체이미지가 추가되었는지 아닌지를 확인하는 state
	//Fix(true): 대체이미지 추가됨, Fix(false): 대체이미지 적용안됨
	const [Fix, setFix] = useState(false);
	const my_id = '199272370@N07';

	const fetchData = async (opt) => {
		let count = 0;
		setLoader(true);
		refFrame.current.classList.remove('on');
		let url = '';
		const api_key = '2a1a0aebb34012a99c23e13b49175343';
		const method_interest = 'flickr.interestingness.getList';
		const num = 10;
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

		const data = await fetch(url);
		const json = await data.json();
		console.log(json.photos.photo);
		if (json.photos.photo.length === 0) {
			return alert('해당 검색어의 결과값이 없습니다.');
		}
		setPics(json.photos.photo);
		const imgs = refFrame.current?.querySelectorAll('img');
		console.log(imgs);
		//실제 데이터가 state에 담기는 순간 가상돔이 생성되는 순간
		imgs.forEach((img) => {
			img.onload = () => {
				++count;
				console.log('현재 로딩된 img갯수', count);
				//이미지 소스 렌더링 유무 카운트할때
				//Fix값이 true이면 대체 이미지가 이미 캐싱되어 있는 상태이므로 profile이미지를 제외한 이미지 갯수와 비교
				//Fix값이 false이면 대체 이미지가 캐싱되어있지 않는 상태이므로 prfoile이미지까지 포함해서 갯수 비교
				if (count === (Fix ? imgs.length / 2 - 1 : imgs.length - 2)) {
					console.log('모든 이미지 소스 렌더링 완료!');
					//모든 소스이미지라 랜더링 완료되면 Loader값을
					//false로 바꿔서 로딩이미지 제거
					setLoader(false);
					refFrame.current.classList.add('on');
				}
			};
		});
	};

	useEffect(() => {
		fetchData({ type: 'user', id: my_id });
	}, []);

	return (
		<Layout title={'Gallery'}>
			<div className='searchBox'>
				<form
					onSubmit={(e) => {
						e.preventDefault();
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
			</div>
			<div className='btnSet' ref={refBtnSet}>
				<button
					className='on'
					onClick={(e) => {
						//각 버튼 클릭시 해당 버튼에 만약 on클래스가 있으면 이미 활성화 되어 있는 버튼이므로 return으로 종료해서
						//fetchData함수 호출 방지
						if (e.target.classList.contains('on')) return;

						const btns = refBtnSet.current.querySelectorAll('button');
						btns.forEach((btn) => btn.classList.remove('on'));
						e.target.classList.add('on');
						fetchData({ type: 'user', id: my_id });
					}}
				>
					My Gallery
				</button>
				<button
					onClick={(e) => {
						//각 버튼 클릭시 해당 버튼에 만약 on클래스가 있으면 이미 활성화 되어 있는 버튼이므로 return으로 종료해서
						//fetchData함수 호출 방지
						if (e.target.classList.contains('on')) return;

						const btns = refBtnSet.current.querySelectorAll('button');
						btns.forEach((btn) => btn.classList.remove('on'));
						e.target.classList.add('on');
						fetchData({ type: 'user', id: my_id });

						fetchData({ type: 'interest' });
					}}
				>
					Interest Gallery
				</button>
			</div>
			{/* Loader가 true일때에만 로딩 이미지 출력 */}
			{Loader && (
				<img className='loading' src={`${process.env.PUBLIC_URL}/img/loading.gif`} alt='loading' />
			)}
			<div className='picFrame' ref={refFrame}>
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
											src={`http://farm${data.farm}.staticflickr.com/${data.server}/buddyicons/${data.owner2}.jpg`}
											alt={data.owner}
											onError={(e) => {
												//만약 프로필 이미지에서 에러가 발생하면 대체이미지를 추가
												//이때 대체이미지는 같은 이미지를 계속 호출하기 때문에 이미 캐싱처리 되어 있어서
												//다음번 렌더링 타이임에 count값에 포함이 안됨
												//따라서 대체이미지 추가 유무를 Fix라는 state에 담아서 구분
												setFix(true);
												e.target.setAttribute('src', 'https://www.flickr.com/images/buddyicon.gif');
											}}
										/>
										<span
											onClick={() => {
												fetchData({ type: 'user', id: data.owner });
											}}
										>
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
