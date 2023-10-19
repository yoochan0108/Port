import Anime from '../../../asset/anime';
import './Btns.scss';
import { useRef, useEffect } from 'react';

function Btns() {
	//ul요소를 담을 참조객체 생성
	const refBtns = useRef(null);
	//새로위치값이 배열로 담길 참조객체 생성
	let pos = useRef([]);

	//컴포넌트 마운트시 myScroll클래스의 모든 섹션의 세로위치값을 배열에 저장하는 함수
	const getPos = () => {
		const secs = document.body.querySelectorAll('.myScroll');
		for (let sec of secs) pos.current.push(sec.offsetTop);
		console.log(pos.current);
	};

	//브라우저 스크롤시 버튼을 반복돌면서 스크롤이 특정 섹션영역을 넘어가면 해당 순번의 버튼 활성화 함수
	const activation = () => {
		const btns = refBtns.current.children;
		const scroll = window.scrollY;

		if (scroll >= pos.current[0]) {
			for (let btn of btns) btn.classList.remove('on');
			btns[0].classList.add('on');
		}
		if (scroll >= pos.current[1]) {
			for (let btn of btns) btn.classList.remove('on');
			btns[1].classList.add('on');
		}
		if (scroll >= pos.current[2]) {
			for (let btn of btns) btn.classList.remove('on');
			btns[2].classList.add('on');
		}
	};

	useEffect(() => {
		getPos();
		window.addEventListener('scroll', activation);
	}, []);

	return (
		<ul className='scroll_navi' ref={refBtns}>
			<li
				className='on'
				onClick={() => {
					new Anime(window, {
						prop: 'scroll',
						value: pos.current[0],
						duration: 500,
					});
				}}
			></li>
			<li
				onClick={() => {
					new Anime(window, {
						prop: 'scroll',
						value: pos.current[1],
						duration: 500,
					});
				}}
			></li>
			<li
				onClick={() => {
					new Anime(window, {
						prop: 'scroll',
						value: pos.current[2],
						duration: 500,
					});
				}}
			></li>
		</ul>
	);
}

export default Btns;

/*
  스크롤 모션 작업 단계
  1. 컴포넌트 마운트시 각각의 버튼 클릭시 이동해야되는 세로 섹션의 위치값들을 배열로 저장하는 함수 호출
  2. 각 세로버튼 클릭시 클릭한 버튼의 순번에 맞는 배열의 위치값을 anime를 활용해서 세로 스크롤 모션 이동
*/
