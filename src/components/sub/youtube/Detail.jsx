import Layout from '../../common/layout/Layout';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './Detail.scss';

function Detail() {
	//url로 전단될 parameter값을 비구조화할당으로 받을 수 있음
	const { id } = useParams();
	const [Data, setData] = useState(null);
	console.log(id);

	useEffect(() => {
		const api_key = process.env.REACT_APP_YOUTUBE_API;
		const baseURL = 'https://www.googleapis.com/youtube/v3/playlistItems';
		fetch(`${baseURL}?key=${api_key}&id=${id}&part=snippet`)
			.then((data) => data.json())
			.then((json) => {
				console.log(json.items[0].snippet);
				setData(json.items[0].snippet);
			});
	}, [id]);
	return (
		<Layout title={'Detail'}>
			<h2>{Data?.title}</h2>
			<p>{Data?.description}</p>
			<div className='vidBox'>
				<iframe
					src={`https://www.youtube.com/embed/${Data?.resourceId.videoId}`}
					title='youtube'
				></iframe>
			</div>
		</Layout>
	);
}

export default Detail;
