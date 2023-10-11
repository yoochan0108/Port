import Layout from '../../common/layout/Layout';
import { useEffect, useState } from 'react';
import './Department.scss';
const path = process.env.PUBLIC_URL;

export default function Department() {
	const [Department, setDepartment] = useState([]);

	useEffect(() => {
		fetch(`${path}/DB/department.json`)
			.then((data) => data.json())
			.then((json) => {
				setDepartment(json.members);
			});
	}, []);

	return (
		<Layout title={'Department'}>
			<div className='memberBox'>
				{Department.map((member, idx) => {
					return (
						<article key={idx}>
							<div className='pic'>
								<img src={`${path}/img/${member.pic}`} alt={member.name} />
								<img src={`${path}/img/${member.pic}`} alt={member.name} />
							</div>
							<h2>{member.name}</h2>
							<p>{member.position}</p>
							<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nihil, nesciunt. </p>
						</article>
					);
				})}
			</div>
		</Layout>
	);
}

/*
	1.hook의 개념
	- 리엑트에서는 크게 2가지 종류의 파일이 존재
	-- 컴포넌트 (화면에 가상돔을 랜더링하는 JSX를 무조건 리턴)
	-- hook (JSX를 리턴하는것이 아닌 각 컴포넌트마다 자주쓰는 기능의 함수나 특정 값을 리턴하는 기능 파일)

	2.useState, useEffect, useRef (리엑트에서 제일 많이 쓰는 기본 hook)
	- useState: 화면에 랜더링을 담당하는 중요한 정보를 담아주고 변경해주는 기능의 훅 (State가 변경되면 컴포넌트는 제호출되면서 화면 재랜더링)
	- useEffect: 컴포넌트의 생성, 변경, 소멸시마다 (컴포넌트의 생명주기마다) 특정 구문을 호출할 수 있는 hook
	-useRef: 참조객체에 실시간으로 특정 정보값을 담기위한 hook (해당 랜더링 사이클에서 최신 가상돔을 담을때, 특정값을 담아두고 변경을 할떄 컴포넌트를 재랜더링 시키고 싶지 않을 때 (모션))

	3.컴포넌트가 하는역할 (JSX)
	- 자바스크립트로 동적 돔을 만들 때 편의성을 위해 HTML형식을 따와서 편하게 동적 DOM 생성을 위한 리엑트만의 표현식

	4.fetch문을 useEffect안쪽에서 호출하는 이유
	- 가상돔 생성은 리엑트 기반의 스크립트가 처리해주시면 외부 데이터를 가져오는 것은 Web API (브라우저)가 처리가기 때문에
	- 컴포넌트가 실제 브라우저상에 마운트가되고 브라우저가 작업 준비가 되야지만 fetch를 실행할 수 있기 때문에
	- useEffect컴포넌트가 마운트 되야지만 CSR방식으로 외부 데이터를 가져올 수 있음.

	컴포넌트 작성 순서
	import로 외부 모듈, 외부 컴포넌트 불러오기
	
	export, default, function 컴포넌트이름(){
		필요시 hook 호출 (hook안에서 hook호출 불가, 핸들러안쪽에서 호출불가)

		필요시 핸들러함수 정의

		useEffect(()=>{
			핸들러 함수 호출 (fetch, 이벤트연결)
		})

		return JSX
	}

	fetch: ES6에서 기본문법으로 포함된 동기적으로 외부 데이터를 가져오는 내장함수

	fetch는 promies반환
	promies가 반환되야지 .then구문 호출가능
	.then구문을 호출해야지만 동기적으로 다음코드 실행가능

	promise: 데이터의 상태값을 추적할 수 있는 객체
	promise의 3가지 상태
	pending: 요청을 보내고 응답을 받기까지의 대기상태
	fulfilled: pending이 끝나고 요청에 대한 응답을 성공적으로 받은 상태
	rejected: pending이 끝나고 요청에 대한 응답을 받긴 하지만 에러를 
	반환받은 상태를 rejected

	JSON (Javascript Object Notation) 자바스크립트 객체 표현식
	-자바스크립트의 객체를 문자열형태로 관리하는 데이터 형식
	-문자 형식으로 되어있는 JSON는 다시 객체형식으로 변환 (parsing)
*/
