import './Visual.scss';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

function Visual() {
	const { data } = useSelector((store) => store.youtube);

	return (
		<section className='visual'>
			<div className='titBox'>
				<ul>
					{data.map((tit, idx) => {
						if (idx >= 5) return null;
						return <li key={idx}>{tit.snippet.title}</li>;
					})}
				</ul>
			</div>
			<Swiper slidesPerView={3} spaceBetween={50} loop={true}>
				{data.map((vid, idx) => {
					if (idx >= 5) return null;
					return (
						<SwiperSlide key={idx}>
							<div className='pic'>
								<img src={vid.snippet.thumbnails.standard.url} alt={vid.title} />
								<img src={vid.snippet.thumbnails.standard.url} alt={vid.title} />
							</div>
						</SwiperSlide>
					);
				})}
			</Swiper>
		</section>
	);
}

export default Visual;
