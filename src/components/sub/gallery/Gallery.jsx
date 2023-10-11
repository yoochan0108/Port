import Layout from '../../common/layout/Layout';
import Modal from '../../common/modal/Modal';
import './Gallery.scss';
import { useState, useEffect, useRef } from 'react';
import Masonry from 'react-masonry-component';

export default function Gallery() {
	const refFrame = useRef(null);
	const refInput = useRef(null);
	const refBtnSet = useRef(null);
	const [Pics, setPics] = useState([]);
	const [Loader, setLoader] = useState(true);
	const [ActiveURL, setActiveURL] = useState('');
	const [Fix, setFix] = useState(false);
	const [IsUser, setIsUser] = useState(true);
	const [Open, setOpen] = useState(false);
	const my_id = '199272370@N07';

	const fetchData = async (opt) => {
		let count = 0;
		setLoader(true);
		refFrame.current.classList.remove('on');
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

		const data = await fetch(url);
		const json = await data.json();
		console.log(json.photos.photo);
		if (json.photos.photo.length === 0) {
			return alert('해당 검색어의 결과값이 없습니다.');
		}
		setPics(json.photos.photo);
		const imgs = refFrame.current?.querySelectorAll('img');

		imgs.forEach((img) => {
			img.onload = () => {
				++count;

				if (count === (Fix ? imgs.length / 2 - 1 : imgs.length - 2)) {
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
		<>
			<Layout title={'Gallery'}>
				<div className='searchBox'>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							setIsUser(false);
							const btns = refBtnSet.current.querySelectorAll('button');
							btns.forEach((btn) => btn.classList.remove('on'));

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
							//마이갤러리 버튼 클릭시 User type갤러리이기 때문에 IsUser값을 true로 변경
							setIsUser(true);
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
							setIsUser(false);
							if (e.target.classList.contains('on')) return;

							const btns = refBtnSet.current.querySelectorAll('button');
							btns.forEach((btn) => btn.classList.remove('on'));
							e.target.classList.add('on');

							fetchData({ type: 'interest' });
						}}
					>
						Interest Gallery
					</button>
				</div>

				{Loader && (
					<img
						className='loading'
						src={`${process.env.PUBLIC_URL}/img/loading.gif`}
						alt='loading'
					/>
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
											onClick={(e) => {
												setActiveURL(e.target.getAttribute('alt'));
												setOpen(true);
											}}
										/>
										<h2>{data.title}</h2>

										<div className='profile'>
											<img
												src={`http://farm${data.farm}.staticflickr.com/${data.server}/buddyicons/${data.owner}.jpg`}
												alt={data.owner}
												onError={(e) => {
													setFix(true);
													e.target.setAttribute(
														'src',
														'https://www.flickr.com/images/buddyicon.gif'
													);
												}}
											/>
											<span
												onClick={() => {
													if (IsUser) return;

													fetchData({ type: 'user', id: data.owner });
													setIsUser(true);
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

			{Open && (
				<Modal>
					<img src={ActiveURL} alt='img' />
				</Modal>
			)}
		</>
	);
}
