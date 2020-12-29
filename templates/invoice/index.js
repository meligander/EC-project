module.exports = (css, img, tbody, invoice) => {
   return `
    <!doctype html>
        <html>
            <head> 
                <meta charset="utf-8">
                <link href=${css} rel="stylesheet" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Courgette&family=Dancing+Script:wght@700&display=swap"
                    rel="stylesheet"
                />
                <link
			        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
			        rel="stylesheet"
		        />
                <title>Factura</title>          
            </head>
            <body> 
                <div class='container'>  
                    <table class="invoice-info">
                        <tbody>
                            <tr>
                                <td>
                                    <h3 class="business">
                                        Villa de Merlo English Center
                                    </h3>
                                    <p>Coronel Mercau 783</p>
                                    <p>Villa de Merlo, San Luis, Argentina</p>
                                    <p>(02656) 476-661</p>
                                </td>
                                <td class='text-right'>
                                    <img src=${img} class='logo' alt="logo"/>                            
                                </td>
                            </tr>
                            <tr class='client'>
                                <td>
                                    <p>Cliente:</p>
                                    <p>${invoice.user}</p>
                                    <p>${invoice.email}</p>
                                    <p>${invoice.cel}</p>
                                </td>
                                <td class="invoice-info text-right">
                                    <p>N° Factura: ${invoice.invoiceid}</p>
                                    <p>Fecha: ${invoice.date}</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table class='details'>
                        <thead>
                            <tr>
                            <th>Nombre</th>
                            <th>Cuota</th>
                            <th>Año</th>
                            <th>Importe</th>
                            <th>Pago</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tbody}
                        </tbody>
                    </table>
                    <div class="text-right summary">
                        <div>
                            <p class="title">Saldo: </p>
                            <p class="value">$${invoice.remaining}</p>
                        </div>
                        <div>
                            <p class="title">Total: </p>
                            <p class="value">$${invoice.total}</p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    `;
};
