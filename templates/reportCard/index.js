module.exports = (
   css,
   img,
   student,
   teacher,
   category,
   allGrades,
   finalGrades,
   attendance,
   observations
) => {
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
           <title>Libreta de ${student}</title>          
        </head>
        <body>
            <div class="border">
                <div class="header">
                    <img class='header-img' src=${img} alt="logo">
                </div> 
                <div class='container'>                       
                        <h2 class='student'>
                            ${student}
                        </h2>
                        <h3 class='subtitle'>
                            Profesor: ${teacher}
                        </h3>
                        <h3 class='subtitle'>
                            Curso: ${category}
                        </h3>
                        <div class="info-about">  
                            <h4>Notas</h4>          
                            <table>
                                <thead>
                                    <th class='no-border'></th>
                                    <th>1° Bimestre</th>
                                    <th>2° Bimestre</th>
                                    <th>3° Bimestre</th>
                                    <th>4° Bimestre</th>
                                </thead>
                                <tbody>
                                    ${allGrades}
                                </tbody>
                            </table>
                            ${finalGrades}
                            <h4>Inasistencias</h4>
                            <table>
                                <thead>
                                    <th>1° Bimestre</th>
                                    <th>2° Bimestre</th>
                                    <th>3° Bimestre</th>
                                    <th>4° Bimestre</th>
                                    <th>Total</th>
                                </thead>
                                <tbody>
                                    ${attendance}
                                </tbody>
                            </table>
                            <h4>Observaciones</h4>
                            <p>${observations}</p>              
                        </div>
                        <div class='signatures'>
                            <div class="signature teacher">
                                <p class="line"></p>
                                <p>Profesor(a)</p>
                            </div>
                            <div class="signature guardian">
                                <p class="line"></p>
                                <p>Padre, madre o tutor</p>
                            </div>                           
                        </div>
                </div>
           </div>           
        </body>
     </html>
     `;
};
