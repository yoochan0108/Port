import Layout from '../../common/layout/Layout';
import './Members.scss';
import { useState, useRef, useEffect } from 'react';

export default function Members() {
	const initVal = {
		userid: '',
		pwd1: '',
		pwd2: '',
		email: '',
		gender: false,
		interests: false,
		edu: '',
		comments: '',
	};
	const refCheckGroup = useRef(null);
	const refRadioGroup = useRef(null);
	const refSelGroup = useRef(null);
	const [Val, setVal] = useState(initVal);
	const [Errs, setErrs] = useState({});

	const resetForm = (e) => {
		e.preventDefault();
		setVal(initVal);
		/*
		const checks = refCheckGroup.current.querySelectorAll('input');
		const radios = refRadioGroup.current.querySelectorAll('input');
		checks.forEach((input) => (input.checked = false));
		radios.forEach((input) => (input.checked = false));
    */
		[refCheckGroup, refRadioGroup].forEach((el) =>
			el.current.querySelectorAll('input').forEach((input) => (input.checked = false))
		);
		refSelGroup.current.value = '';
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setVal({ ...Val, [name]: value });
	};

	const handleRadio = (e) => {
		const { name, checked } = e.target;
		setVal({ ...Val, [name]: checked });
	};

	const handleCheck = (e) => {
		const { name } = e.target;
		let isChecked = false;
		const inputs = e.target.parentElement.querySelectorAll('input');
		inputs.forEach((input) => input.checked && (isChecked = true));
		setVal({ ...Val, [name]: isChecked });
	};

	const check = (value) => {
		const num = /[0-9]/;
		const txt = /[a-zA-Z]/;
		const spc = /[!@#$%^*()_]/;
		const errs = {};

		if (value.userid.length < 5) {
			errs.userid = '아이디는 최소 5글자 이상 입력하세요.';
		}

		//비밀번호 인증 (5글자 이상, 문자, 숫자, 특수문자 모두 포함)
		if (
			value.pwd1.length < 5 ||
			!num.test(value.pwd1) ||
			!txt.test(value.pwd1) ||
			!spc.test(value.pwd1)
		) {
			errs.pwd1 = '비밀번호는 5글자이상, 문자,숫자,특수문자를 모두 포함하세요';
		}

		//비밀번호 재확인 인증
		if (value.pwd1 !== value.pwd2 || !value.pwd2) {
			errs.pwd2 = '2개의 비밀번호를 같게 입력하세요.';
		}

		//이메일 인증
		if (!value.email || !/@/.test(value.email)) {
			errs.email = '이메일은 무조건 @를 포함해야 합니다.';
		} else {
			const [forward, backward] = value.email.split('@');
			if (!forward || !backward) {
				errs.email = '이메일에 @앞뒤로 문자값이 있어야 합니다.';
			} else {
				const [forward, backward] = value.email.split('.');
				if (!forward || !backward) {
					errs.email = '이메일 . 앞뒤로 문자값이 있어야 합니다.';
				}
			}
		}

		//성별인증
		if (!value.gender) {
			errs.gender = '성별은 필수 체크항목입니다.';
		}

		//관심사인증
		if (!value.interests) {
			errs.interests = '관심사를 하나이상 체크해주세요.';
		}

		//학력 인증
		if (!value.edu) {
			errs.edu = '학력을 선택하세요.';
		}
		//남기는말 인증
		if (value.comments.length < 10) {
			errs.comments = '남기는말은 10글자 이상 입력하세요.';
		}
		return errs;
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (Object.keys(check(Val)).length === 0) {
			alert('인증통과');
		} else {
			setErrs(check(Val));
		}
	};

	const showCheck = () => {
		setErrs(check(Val));
	};

	useEffect(() => {
		showCheck();
	}, [Val]);

	return (
		<Layout title={'Members'}>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<legend className='h'>회원가입 폼 양식</legend>
					<table border='1'>
						<tbody>
							{/* userid */}
							<tr>
								<th scope='row'>
									<label htmlFor='userid'>Userid</label>
								</th>
								<td>
									<input
										type='text'
										id='userid'
										name='userid'
										value={Val.userid}
										onChange={handleChange}
										placeholder='아이디를 입력하세요.'
									/>
									{Errs.userid && <p>{Errs.userid}</p>}
								</td>
							</tr>

							{/* password */}
							<tr>
								<th scope='row'>
									<label htmlFor='pwd1'>Password</label>
								</th>
								<td>
									<input
										type='password'
										id='pwd1'
										name='pwd1'
										value={Val.pwd1}
										onChange={handleChange}
										placeholder='비밀번호를 입력하세요.'
									/>
									{Errs.pwd1 && <p>{Errs.pwd1}</p>}
								</td>
							</tr>

							{/* re password */}
							<tr>
								<th scope='row'>
									<label htmlFor='pwd2'>RE-Password</label>
								</th>
								<td>
									<input
										type='password'
										id='pwd2'
										name='pwd2'
										value={Val.pwd2}
										onChange={handleChange}
										placeholder='비밀번호를 재입력하세요.'
									/>
									{Errs.pwd2 && <p>{Errs.pwd2}</p>}
								</td>
							</tr>

							{/* email */}
							<tr>
								<th scope='row'>
									<label htmlFor='email'>E-mail</label>
								</th>
								<td>
									<input
										type='text'
										id='email'
										name='email'
										value={Val.email}
										onChange={handleChange}
										placeholder='이메일주소를 입력하세요.'
									/>
									{Errs.email && <p>{Errs.email}</p>}
								</td>
							</tr>

							{/* gender */}
							<tr>
								<th>gender</th>
								<td ref={refRadioGroup}>
									<label htmlFor='female'>Female</label>
									<input type='radio' name='gender' id='female' onChange={handleRadio} />

									<label htmlFor='male'>Male</label>
									<input type='radio' name='gender' id='male' onChange={handleRadio} />
									{Errs.gender && <p>{Errs.gender}</p>}
								</td>
							</tr>

							{/* interests */}
							<tr>
								<th>interests</th>
								<td ref={refCheckGroup}>
									<label htmlFor='sports'>Sports</label>
									<input type='checkbox' id='sports' name='interests' onChange={handleCheck} />

									<label htmlFor='game'>Game</label>
									<input type='checkbox' id='game' name='interests' onChange={handleCheck} />

									<label htmlFor='music'>Music</label>
									<input type='checkbox' id='music' name='interests' onChange={handleCheck} />
									{Errs.interests && <p>{Errs.interests}</p>}
								</td>
							</tr>

							{/* education */}
							<tr>
								<th>
									<label htmlFor='edu'>Education</label>
								</th>
								<td>
									<select name='edu' id='edu' onChange={handleChange} ref={refSelGroup}>
										<option value=''>최종학력 선택하세요</option>
										<option value='elementary-school'>초등학교 졸업</option>
										<option value='middle-school'>중학교 졸업</option>
										<option value='high-school'>고등학교 졸업</option>
										<option value='college'>대학교 졸업</option>
									</select>
									{Errs.edu && <p>{Errs.edu}</p>}
								</td>
							</tr>

							{/* comments */}
							<tr>
								<th>
									<label htmlFor='comments'>Comments</label>
								</th>
								<td>
									<textarea
										name='comments'
										id=''
										cols='30'
										rows='3'
										value={Val.comments}
										onChange={handleChange}
									></textarea>
									{Errs.comments && <p>{Errs.comments}</p>}
								</td>
							</tr>

							{/* btnSet */}
							<tr>
								<th colSpan='2'>
									<input type='reset' value='cancel' onClick={resetForm} />
									<input type='submit' value='send' />
								</th>
							</tr>
						</tbody>
					</table>
				</fieldset>
			</form>
		</Layout>
	);
}
/*
	react-hook-form을 쓰지 않고 직접 기능을 만들었냐?
	-- 라이브러리는 언제든지 연결할 수 있는건데, 아직 배우는 입장이기 때문에 부족하나마 어떤 
	인증로직이 처리되는지 직접 만들어 보고 싶었다.

	그래서 checkbox, radio, select, textarea 같이 필수입력사항이 아닌 요소도 직접 인증구현을 해봤다.
	인증처리 하면서 제일 힘들었던 부분은 비밀번호, 이메일 인증 구현이 힘들었다

	구글링을 해보니 정규표현식의 예시코드가 많이 있었지만 아직 정규표현식을 제대로 공부한것이 아니라
	모르는 상태에서 붙여넣기 식으로 구현하기는 싫어서
	내가 알고 있는 문자열 관련 매서드를 최대한 활용해서 구현해봤다
*/
