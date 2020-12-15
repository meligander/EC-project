module.exports = (css, img, student, level, body, average, date) => {
   return `
         <!doctype html>
         <html>
             <head> 
                 <meta charset="utf-8">
                 <link href=${css} rel="stylesheet" />
                 <title>Certificado fin de año</title>          
             </head>
             <body>
                 <div class='container'>  
                    <div class='header text-center'>
                        <img src=${img} alt="logo"/>
                        <h4>
                            De Lilia Cristina Anderlini 
                        </h4>
                    </div>
                    <div class="body">
                        <div class='student'>
                            <p>Se extiende el presente CERTIFICADO a favor de:</p>
                            <h2 class="text-center capital">${student.name}</h2>
                            <h3 class="text-right"><span class="lighter">DNI:</span>&nbsp;  ${student.dni} </h3>
                        </div>
                        <div class='grades'>
                            <p>Quien ha rendido el exámen de Inglés equivalente a :</p>
                            <h3 class='capital text-center'>Cambridge -Young Learners-</h3>
                            <h3>Nivel:</h3>
                            <h3 class='level text-up'>${level}</h3>
                            <p class='average text-up'>con las siguientes calificaciones:</p>
                            ${body}
                            <p class='average'><span class="capital">Promedio:</span> &nbsp; ${average}%</p>
                        </div>
                        <p class='date'>Villa de Merlo, SL, ${date}</p>
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
