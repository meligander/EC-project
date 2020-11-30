module.exports = (htmlstring) => {
	return `
    <!doctype html>
    <html>
       <head>
          <meta charset="utf-8">
          <style>
             .container {
               padding: 3rem 4.5rem;
               text-align: center;
             }
             .title {
                font-size: 3rem;
                font-family: "Bookman Old Style";
             }
             table {
               width: 100%;
               font-size: 1.5rem;
                
             }
             table th, table td {
               border: 1px solid #333;
             }
             table th {
               font-weight: bold;
               padding: 1rem 2rem;
             }
             table td {
               padding: 0.5rem 1rem;
             }             
          </style>
          <title>Lista de Inscripciones</title>          
       </head>
       <body>
          <div class='container'>
            <h2 class='title'>
               Lista de inscripciones
            </h2>
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
