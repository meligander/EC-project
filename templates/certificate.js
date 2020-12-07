module.exports = (css, img, student) => {
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
                <title>Certificado fin de año</title>          
            </head>
            <body>
                <div class='container'>  
                    <table class="header">
                        <tbody>
                            <tr>
                                <td class='logo'>
                                    <img src=${img} alt="logo"/>                            
                                </td>
                                <td>
                                    <h4>
                                        De Lilia Cristina Anderlini
                                    </h4>
                                    <p>Profesora de inglés</p>
                                    <p>Universidad Nacional de Córdoba</p>
                                    <p>Coronel Mercau 783   Tel: (02656) 476-661</p>
                                    <p>Villa de Merlo, San Luis, Argentina</p>
                                </td>                                
                            </tr>                            
                        </tbody>
                    </table>
                    <div>
                        <p>Se extiende el presente CERTIFICADO a favor de:</p>
                        <p className="text-center">${student.lastname}, ${student.name}</p>
                        <p className="text-right">DNI: ${student.dni} </p>
                    </div>
                </div>
            </body>
        </html>
       `;
};
