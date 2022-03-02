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
            <link href="https://fonts.googleapis.com/css2?family=Tinos:wght@400;700&display=swap" rel="stylesheet">
            <title>Clase de ${data.info.teacher}</title>
         </head>
         <body>
            <div class="header">
              <img class='header-img' src=${data.style.img} alt="logo">
            </div>
            <div class='container'>
              <h2 class='teacher'>
                Profesor: ${data.info.teacher}
              </h2>
              <div class="class-info">
                <h3 class='category'>${data.info.category}</h3>
                <table class="schedule ${data.table.thead ? "none" : ""}">
                    <tbody>
                        <tr>
                            <td>
                                <p>Día 1: ${data.info.day1}</p>
                                <p>
                                    <span class="space">Entrada: ${
                                       data.info.hourin1
                                    }</span>
                                    Salida: ${data.info.hourout1}
                                </p>
                            </td>
                            <td>
                                <p>Día 1: ${data.info.day2}</p>
                                <p>
                                    <span class="space">Entrada: ${
                                       data.info.hourin2
                                    }</span>
                                    Salida: ${data.info.hourout2}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>
              </div>
              <table class='${data.table.thead ? "blank" : ""}'>
                 <thead>
                    <tr>
                        ${
                           data.table.thead
                              ? data.table.thead
                              : "<th>Legajo</th> <th>Nombre</th> <th>Fecha de Nacimiento</th> <th>DNI</th> <th>Celular</th>"
                        }
                    </tr>
                 </thead>
                 <tbody>
                    ${data.table.tbody}
                 </tbody>
              </table>
            </div>
         </body>
      </html>
      `;
};
