import React from 'react';

const Contact = () => {
	return (
		<section className='contact mt-5'>
			<h1 className='text-primary heading-primary text-center'>Contáctanos</h1>
			<div className='row'>
				<div className='contact-box heading-tertiary'>
					<i className='fas fa-phone contact-box-icon'></i>
					<h3 className=' mb-3'>Teléfono</h3>
					<p className='heading-tertiary contact-box-text '>(02656) 476-661</p>
				</div>
				<div className='contact-box heading-tertiary'>
					<i className='far fa-envelope contact-box-icon'></i>
					<h3 className=' mb-3'>Email</h3>
					<p className='heading-tertiary contact-box-text'>
						vdmenglishcenter@gmail.com
					</p>
				</div>
				<div className='contact-box heading-tertiary'>
					<i className='fas fa-map-marked-alt contact-box-icon'></i>
					<h3 className=' mb-3'>Dirección</h3>
					<p className='heading-tertiary contact-box-text'>
						Coronel Mercau 783
					</p>
				</div>
			</div>
			<div className='google'>
				<iframe
					src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3370.9031683446124!2d-65.01416217090146!3d-32.34130900603453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95d2e108fd55ebf5%3A0xb3c61067142f9884!2sInstituto%20English%20Centre%20-%20Villa%20de%20Merlo!5e0!3m2!1ses!2sus!4v1587586479934!5m2!1ses!2sus'
					frameBorder='0'
					title='English center map'
					allowFullScreen=''
					aria-hidden='false'
					tabIndex='0'
				></iframe>
			</div>
		</section>
	);
};

export default Contact;
