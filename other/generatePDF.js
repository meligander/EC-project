const puppeteer = require("puppeteer-core");
const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");

hbs.registerHelper("if_and", (v1, v2, options) => {
   if (v1 && v2) return options.fn(this);
   return options.inverse(this);
});

hbs.registerHelper("if_even", (conditional, options) => {
   if (conditional % 2 == 0) return options.fn(this);
   else return options.inverse(this);
});

hbs.registerHelper("if_or", (v1, v2, options) => {
   if (v1 || v2) return options.fn(this);
   else return options.inverse(this);
});

hbs.registerHelper("if_img", (average, value, imgs) => {
   if (average >= value) return imgs.logo;
   if (average > value - 20 && average < value) return imgs.halfHalf;
   return imgs.gray;
});

const generatePDF = async (fileName, data, style, keepOpen) => {
   const browser = await puppeteer.launch({
      executablePath:
         process.env.LOCATION === "localhost"
            ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
            : "/usr/bin/chromium-browser",
   });

   const page = await browser.newPage();

   let img;
   if (style.img) img = loadImg(style.img);

   const content = await compile(style.type, data, img);

   await page.setContent(content);

   await page.addStyleTag({ path: getFilePath("css", style.type) });

   await page.emulateMediaFeatures("screen");

   await page.pdf({
      path: fileName,
      format: "A4",
      printBackground: true,
      landscape: style.landscape,
      ...(style.type === "invoice" && {
         margin: {
            top: "50px",
            bottom: "50px",
            right: "50px",
            left: "50px",
         },
      }),
      ...(["list", "class", "allGrades"].indexOf(style.type) !== -1 && {
         displayHeaderFooter: true,
         headerTemplate: style.margin
            ? `
         <div style='width: 100% !important; margin: -6px 20px 0; display: flex; align-items: center; justify-content: space-between'>
            <img style='width: 40px; height:40px;' src="data:image/jpeg;base64,${img}" alt="logo">
            <p style='font-size: 13px !important; font-family: "Courgette", cursive; font-weight: 100; color: lightgray;'>Villa de Merlo English Center</p>
            <img style='width: 40px; height:40px;' src="data:image/jpeg;base64,${img}" alt="logo">
        </div>`
            : "<div></div>",
         footerTemplate: `
         <footer style='font-size: 10px !important; width: 100% !important; color: lightgray; font-family: "Courgette", cursive; font-weight: 100; display: flex; align-items:center; justify-content: space-between; margin: 0 20px -5px;'>
            <span>Lista de ${data.title}</span>
            <span><span class="pageNumber"></span>/<span class="totalPages"></span></span>
        </footer>`,
         margin: {
            top: style.margin ? "80px" : "45px",
            bottom: "45px",
            right: "45px",
            left: "45px",
         },
      }),
   });

   console.log("PDF done");

   if (!keepOpen) await browser.close();
};

const loadImg = (type) => {
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
