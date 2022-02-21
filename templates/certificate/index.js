module.exports = (data) => {
   return `
        <!doctype html>
        <html>
            <head>
                <meta charset="utf-8">
                <link href=${data.style.css} rel="stylesheet" />
                <title>Certificado fin de año</title>
            </head>
            <body>
                <div class='container'>
                    <table class="header">
                        <tbody>
                            <tr>
                                <td class='logo'>
                                    <img src=${data.style.img} alt="logo"/>
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
                    <div class="body">
                        <div class='student'>
                            <p>Se extiende el presente CERTIFICADO a favor de:</p>
                            <h2 class="text-center capital">${data.student.name}</h2>
                            <h3 class="text-right"><span class="lighter">DNI:</span>&nbsp;  ${data.student.dni} </h3>
                        </div>
                        <div class='grades'>${data.body}</div>
                        <p class='date'>Villa de Merlo, SL, ${data.date}</p>
                        <div class='signature'>
                            <p class="line"></p>
                            <p>Directora</p>
                            <p>Lilia Cristina Anderlini</p>
                        </div>
                    </div>
                </div>
            </body>
        </html>
       `;
};
