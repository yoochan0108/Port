import Layout from '../../common/layout/Layout';
import './Community.scss';
import { useRef, useState } from 'react';

export default function Community() {
	const refInput = useRef(null);
	const refTextarea = useRef(null);
	const [Posts, setPosts] = useState([]);

	const resetForm = () => {
		refInput.current.value = '';
		refTextarea.current.value = '';
	};
	const createPost = () => {
		if (!refInput.current.value.trim() || !refTextarea.current.value.trim()) {
			resetForm();
			return alert('제목과 본문을 모두 입력하세요.');
		}
		//기존 Posts 배열값을 Deep copy해서 가져온뒤, 그 뒤에 추가로 방금 입력한 객체를 배열에 추가
		setPosts([{ title: refInput.current.value, content: refTextarea.current.value }, ...Posts]);
		resetForm();
	};

	const deletePost = (delIndex) => {
		//기존 Posts배열을 반복 돌면서 인수로 전달된 삭제 순번값과 현재 반복되는 배열의 순번값이 같지 않은 것만 리턴
		setPosts(Posts.filter((_, idx) => delIndex !== idx));
	};

	return (
		<Layout title={'Community'}>
			<div className='inputBox'>
				<input ref={refInput} type='text' placeholder='제목을 입력하세요.' />
				<br />
				<textarea ref={refTextarea} cols='30' rows='3' placeholder='본문을 입력하세요.'></textarea>

				<nav className='btnSet'>
					<button onClick={resetForm}>cancel</button>
					<button onClick={createPost}>write</button>
				</nav>
			</div>

			<div className='showBox'>
				{Posts.map((post, idx) => {
					return (
						<article key={idx}>
							<div className='txt'>
								<h2>{post.title}</h2>
								<p>{post.content}</p>
							</div>

							<nav className='btnSet'>
								<button>Edit</button>
								<button onClick={() => deletePost(idx)}>Delete</button>
							</nav>
						</article>
					);
				})}
			</div>
		</Layout>
	);
}

/*
  Create : 게시글 저장
  Read : 게시글 보기
  Update : 게시글 수정
  Delete : 게시글 삭제

  localStorage : 모든 브라우저가 가지고 있는 경량의 저장소 (문자열: 5MB)
*/
