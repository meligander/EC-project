module.exports = (css, img, name, table, htmlstring) => {
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
          <title>Lista de ${name}</title>          
       </head>
       <body>
          <div class="header">
            <img class='header-img' src=${img} alt="logo">
          </div> 
          <div class='container'>                       
            <h2 class='title'>
               Lista de ${name}
            </h2>            
            <table>
               <thead>
                  <tr>
                  ${table}                     
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
