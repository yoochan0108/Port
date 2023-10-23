//해당 유튜브 페이지 작업에 대해서 설명, 이슈사항은 없었는지
import Layout from '../../common/layout/Layout';
import { Link } from 'react-router-dom';
import { useYoutubeQuery } from '../../../hooks/useYoutube';
import './Youtube.scss';

export default function Youtube() {
	const { data: Youtube, isSuccess } = useYoutubeQuery();

	return (
		<>
			<Layout title={'Youtube'}>
				{isSuccess &&
					Youtube.map((data, idx) => {
						let tit = data.snippet.title;
						let desc = data.snippet.description;
						let date = data.snippet.publishedAt;

						return (
							<article key={idx}>
								<div className='titBox'>
									<h2>{tit.length > 60 ? tit.substr(0, 60) + '...' : tit}</h2>
								</div>

								<div className='conBox'>
									<p>{desc.length > 180 ? desc.substr(0, 180) + '...' : desc}</p>
									<span>{date.split('T')[0].split('-').join('.')}</span>
								</div>

								<div className='picBox'>
									<Link to={`/detail/${data.id}`}>
										<img src={data.snippet.thumbnails.standard.url} alt={data.title} />
									</Link>
								</div>
							</article>
						);
					})}
			</Layout>
		</>
	);
}

//해당페이지는 유튜브 api를 활용해서 비동기데이터, 서버사이드 데이터를 활용하는 페이지
//유튜브 데이터는 유튜브 컴포넌트에서만 호출하는 것이 아닌 메인페이지의 비주얼컴포넌트에도 호출해야 되는 이슈 발생
//처음에는 단순하게 fetching함수를 똑같이 호출해서 구현하려고 햇었는데 같은 함수를 두번 호출하는게 비효율적으로 느껴짐
//구글링으로 redux라는 전역 상태관리 라이브러리를 검색해서 redux-saga방식을 알아냈는데
//내가 느끼기에는 너무 동작방식이 중앙집중적이고 간단한 비동기 데이터를 전역관리하기에는 코드의 복잡도가 커서 비효율적으로 느껴짐
//대안으로 redux-toolkit이라는 것을 활용했다. 비동기데이터의 상태에 따라서 자동으로 액셔객체를 생성해주고 액션객체의 상태에 따라서 리듀서 알아서 전역데이터를 변경해주는 방식이 효율적으로 느껴져서 적용을 해봤다.
//리덕스 툴깃을 활용함으로써 컴포넌트안쪽에서 비동기 데이터 함수를 관리하는게 아닌 컴포넌트 외부의 slice파일을 통해서 컴포넌트 외부에서 비동기데이터별로 fetching함수와 리듀서 함수를 한번에 관리할 수 있는 부분이 편하게 느껴졌다.
