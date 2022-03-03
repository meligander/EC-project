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
          <title>Lista de ${data.title}</title>
       </head>
       <body>
          <div class="header">
            <img class='header-img' src=${data.style.img} alt="logo">
          </div>
          <div class='container'>
          ${
             data.title
                ? `  <h2 class='title${data.small ? " big" : ""}'>
                        Lista de ${data.title}
                     </h2>`
                : ""
          }
            <table ${data.small ? 'class="small"' : ""}>
               <thead>
                  <tr>
                  ${data.table.thead}
                  </tr>
               </thead>
               <tbody>
                  ${data.table.tbody}
               </tbody>
            </table>
            ${
               data.total
                  ? `
            <div class='total'>
               Total: $${data.total}
            </div>`
                  : ""
            }
          </div>
       </body>
    </html>
    `;
};
