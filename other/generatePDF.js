const puppeteer = require("puppeteer-core");
const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");

// hbs.registerHelper("ifCond", (v1, v2, options) => {
//    if (v1 === v2) return options.fn(this);
//    return options.inverse(this);
// });

const generatePDF = async (fileName, data, loadImg, margin, landscape) => {
   const browser = await puppeteer.launch({
      executablePath:
         process.env.LOCATION === "localhost"
            ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            : "/usr/bin/chromium-browser",
   });
   const page = await browser.newPage();

   let img;
   if (loadImg) img = loadImgs(loadImg);

   const content = await compile(data.style, data, img);

   await page.setContent(content);
   await page.addStyleTag({ path: getFilePath("css", data.style) });

   await page.emulateMediaFeatures("screen");

   await page.pdf({
      path: fileName,
      format: "A4",
      printBackground: true,
      landscape,
      ...(["cert", "cert-cdg", "inv"].indexOf(data.style) === -1 && {
         displayHeaderFooter: true,
         headerTemplate: margin
            ? `
         <div style='width: 100% !important; margin: -15px 20px 0; display: flex; align-items: center; justify-content: space-between'>
            <img style='width: 30px; height:30px;' src="data:image/jpeg;base64,${img}" alt="logo">
            <p style='font-size: 15px !important'>Villa de Merlo English Center</p>
            <img style='width: 30px; height:30px;' src="data:image/jpeg;base64,${img}" alt="logo">
        </div>`
            : "<div></div>",
         footerTemplate: `
         <footer style='font-size: 10px !important; width: 100% !important; color: grey; display: flex; align-items:center; justify-content: space-between; margin: 0 20px -5px;'>
            <span>Villa de Merlo English Center  -  Lista de ${data.title}</span>
            <span><span class="pageNumber"></span>/<span class="totalPages"></span></span>
        </footer>`,
         margin: {
            top: margin ? "55px" : "45px",
            bottom: "45px",
            right: "45px",
            left: "45px",
         },
      }),
   });

   console.log("PDF done");

   await browser.close();
};

const loadImgs = (type) => {
   if (type === "logo")
      return fs.readFileSync(getFilePath("assets", "logo")).toString("base64");
   else
      return {
         logo: fs
            .readFileSync(getFilePath("assets", "logo"))
            .toString("base64"),
         gray: fs
            .readFileSync(getFilePath("assets", "grayLogo"))
            .toString("base64"),
         halfHalf: fs
            .readFileSync(getFilePath("assets", "halfAndHalf"))
            .toString("base64"),
      };
};

const compile = async (fileType, data, img) => {
   const html = await fs.readFile(getFilePath("hbs", fileType), "utf-8");

   return hbs.compile(html)({ ...data, img });
};

const getFilePath = (type, fileType) =>
   path.join(
      __dirname,
      `../templates/${type}/${fileType}.${type === "assets" ? "png" : type}`
   );

module.exports = generatePDF;
