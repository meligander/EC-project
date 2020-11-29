import React from 'react';
import Tabs from '../../../Tabs';
import InstallmentsSearch from '../../../InstallmentsSearch';
import InvoiceTab from './InvoiceTab';

const Invoice = () => {
	return (
		<>
			<div>
				<h1>Facturación</h1>
				<Tabs
					tablist={['Cuotas', 'Factura']}
					panellist={[InstallmentsSearch, InvoiceTab]}
				/>
			</div>
		</>
	);
};

export default Invoice;
