const format = require("date-fns/format");

module.exports = (css, img, tbody, classInfo, table) => {
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
            <title>Clase de ${
               classInfo.teacher.lastname + " " + classInfo.teacher.name
            }</title>          
         </head>
         <body>
            <div class="header">
              <img class='header-img' src=${img} alt="logo">
            </div> 
            <div class='container'>                       
              <h2 class='teacher'> 
                Profesor: ${
                   classInfo.teacher.lastname + " " + classInfo.teacher.name
                }
              </h2> 
              <div class="class-info">
                <h3 class='category'>${classInfo.category.name}</h3>
                <table class="schedule ${table ? "none" : ""}">
                    <tbody>
                        <tr>
                            <td>
                                <p>Día 1: ${classInfo.day1}</p>
                                <p>
                                    <span class="space">Entrada: ${format(
                                       new Date(classInfo.hourin1.slice(0, -1)),
                                       "HH:mm"
                                    )}</span>
                                    Salida: ${format(
                                       new Date(
                                          classInfo.hourout1.slice(0, -1)
                                       ),
                                       "HH:mm"
                                    )}
                                </p>
                            </td>
                            <td>
                                <p>Día 1: ${classInfo.day2}</p>
                                <p>
                                    <span class="space">Entrada: ${format(
                                       new Date(classInfo.hourin2.slice(0, -1)),
                                       "HH:mm"
                                    )}</span>
                                    Salida: ${format(
                                       new Date(
                                          classInfo.hourout2.slice(0, -1)
                                       ),
                                       "HH:mm"
                                    )}
                                </p>
                            </td>
                        </tr>
                    </tbody>
                </table>    
              </div>       
              <table class='${table ? "blank" : ""}'>
                 <thead>
                    <tr>
                        ${
                           table
                              ? table
                              : "<th>Legajo</th> <th>Nombre</th> <th>Fecha de Nacimiento</th> <th>Celular</th>"
                        }                                   
                    </tr>
                 </thead>
                 <tbody>
                    ${tbody}
                 </tbody>
              </table>
            </div>
         </body>
      </html>
      `;
};
