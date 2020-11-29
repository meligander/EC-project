const moment = require('moment');

module.exports = (enrollments) => {
	let htmlstring = '';
	for (let x = 0; x < enrollments.length; x++) {
		htmlstring =
			htmlstring +
			'<tr> <td>' +
			moment(enrollments[x].date).format('DD/MM/YY') +
			'</td>';
		htmlstring =
			htmlstring + '<td>' + enrollments[x].student.studentnumber + '</td>';
		htmlstring =
			htmlstring +
			'<td>' +
			enrollments[x].student.lastname +
			' ' +
			enrollments[x].student.name +
			'</td>';
		htmlstring = htmlstring + '<td>' + enrollments[x].category.name + '</td>';
		htmlstring = htmlstring + '<td>' + enrollments[x].year + '</td> </tr>';
	}

	return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <link href="../../documents/css/style.css" rel="stylesheet"/>
          <title>Lista de Inscripciones</title>          
       </head>
       <body>
          <div>
          <div className="name">
          Hola
          </div>
            <table>
               <thead>
                  <tr>
                     <th>Fecha</th>
                     <th>Legajo</th>
                     <th>Nombre</th>
                     <th>Categoría</th>
                     <th>Año</th>
                  </tr>
               </thead>
               <tbody>
                  ${htmlstring}
               </tbody>
            </table>
          </div>
       </body>
    </html>
    `;
};
