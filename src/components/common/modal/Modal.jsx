import './Modal.scss';
import { useEffect } from 'react';

function Modal({ children, setIsModal }) {
	useEffect(() => {
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = 'auto  ';
		};
	});
	return (
		<aside className='Modal'>
			<div className='con'>{children}</div>
			<span onClick={() => setIsModal(false)}>close</span>
		</aside>
	);
}

export default Modal;
