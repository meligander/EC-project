module.exports = (data) => {
   return `
     <!doctype html>
     <html>
        <head>
           <meta charset="utf-8">
           <link href=${data.style.css} rel="stylesheet" />
           <link
                href="https://fonts.googleapis.com/css2?family=Courgette&family=Dancing+Script:wght@700&display=swap"
             rel="stylesheet"
           />
           <title>Libreta de ${data.student.name}</title>
        </head>
        <body>
            <div class="border">
                <div class="header">
                    <img class='header-img' src=${data.style.img} alt="logo">
                </div>
                <div class='container'>
                        <h2 class='student'>
                            ${data.student.name}
                        </h2>
                        <h3 class='subtitle'>
                            Profesor: ${data.teacher}
                        </h3>
                        <h3 class='subtitle'>
                            Curso: ${data.category}
                        </h3>
                        <div class="info-about">
                            <h4>Notas</h4>
                            <table class='grades'>
                                <thead>
                                    <th class='no-border'></th>
                                    <th>1° Bimestre</th>
                                    <th>2° Bimestre</th>
                                    <th>3° Bimestre</th>
                                    <th>4° Bimestre</th>
                                </thead>
                                <tbody>
                                    ${data.gradesTable}
                                </tbody>
                            </table>
                            ${data.finalTable}
                            <h4>Inasistencias</h4>
                            <table>
                                <thead>
                                    <th>1° Bimestre</th>
                                    <th>2° Bimestre</th>
                                    <th>3° Bimestre</th>
                                    <th>4° Bimestre</th>
                                    <th>Total</th>
                                </thead>
                                ${data.attendances}
                            </table>
                            <h4>Observaciones</h4>
                            <p>${data.student.observation.description}</p>
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
