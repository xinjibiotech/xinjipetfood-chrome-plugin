#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

const root = path.resolve(__dirname, "..");
const outputDir = path.join(root, "store-assets");
const logoPath = path.join(root, "icons", "logo.png");
const logoData = fs.readFileSync(logoPath).toString("base64");
const logoSrc = `data:image/png;base64,${logoData}`;

const screenshots = [
  {
    file: "01-product-search.png",
    title: "Pet Food OEM Product Search",
    subtitle: "Find formulas by product, ingredient, category and packaging need.",
    hero: "Chicken Adult Dry Pet Food",
    cards: ["Ingredients: chicken meal, rice, fish oil", "Packaging: 1kg / 2.5kg / 10kg / OEM bag", "Open official page | Favorite | Copy Link"]
  },
  {
    file: "02-official-navigation.png",
    title: "Verified Xinji Website Navigation",
    subtitle: "No broken search URLs. Buttons open stable official pages.",
    hero: "pet food -> /products/pet-food/",
    cards: ["pet supplements -> /products/pet-health-products/", "pet OEM/ODM -> /oem-odm/", "pet export -> buyer resource or contact page"]
  },
  {
    file: "03-ingredient-comparison.png",
    title: "Ingredient Comparison for Buyers",
    subtitle: "Compare two B2B pet food or supplement profiles before sending an inquiry.",
    hero: "Formula comparison table",
    cards: ["Product A: chicken meal, rice, fish oil", "Product B: glucosamine, MSM, collagen", "Category, packaging and official link in one view"]
  },
  {
    file: "04-export-favorites.png",
    title: "Export and Save Sourcing Records",
    subtitle: "Build a clean product shortlist for internal purchasing discussion.",
    hero: "CSV / JSON / Product Profile",
    cards: ["Favorite products for repeated access", "Export product list with official URLs", "Copy links for buyer communication"]
  },
  {
    file: "05-oem-inquiry.png",
    title: "Pet Food OEM Inquiry Support",
    subtitle: "When no product detail page exists, the extension keeps the product profile available.",
    hero: "Internal product detail fallback",
    cards: ["Title, ingredients, MOQ and packaging", "Official contact page and inquiry deep link", "Useful for pet food OEM and export conversations"]
  }
];

function baseStyles() {
  return `
    * { box-sizing: border-box; }
    body {
      margin: 0;
      width: 1280px;
      height: 800px;
      font-family: Arial, Helvetica, sans-serif;
      color: #17202a;
      background: linear-gradient(135deg, #f6fbff 0%, #eef7fb 48%, #f9fbfd 100%);
    }
    .frame {
      display: grid;
      grid-template-columns: 430px 1fr;
      gap: 44px;
      width: 100%;
      height: 100%;
      padding: 58px 70px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 56px;
    }
    .brand img {
      width: 72px;
      height: 72px;
      border-radius: 18px;
      box-shadow: 0 12px 30px rgba(0, 78, 160, 0.16);
    }
    .brand strong {
      display: block;
      font-size: 26px;
      line-height: 1.15;
    }
    .brand span {
      display: block;
      margin-top: 5px;
      color: #53657a;
      font-size: 16px;
    }
    h1 {
      margin: 0 0 18px;
      color: #075fac;
      font-size: 56px;
      line-height: 1.05;
      letter-spacing: 0;
    }
    .subtitle {
      margin: 0;
      color: #53657a;
      font-size: 24px;
      line-height: 1.35;
    }
    .keywords {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 44px;
    }
    .keywords span {
      border: 1px solid #bfdbfe;
      border-radius: 999px;
      padding: 9px 14px;
      color: #075fac;
      background: #ffffff;
      font-size: 17px;
      font-weight: 700;
    }
    .panel {
      align-self: center;
      border: 1px solid #d9e6f2;
      border-radius: 18px;
      padding: 24px;
      background: #ffffff;
      box-shadow: 0 28px 70px rgba(10, 79, 124, 0.14);
    }
    .search {
      display: grid;
      grid-template-columns: 1fr 112px;
      gap: 12px;
      margin-bottom: 18px;
    }
    .search div {
      border: 1px solid #cddbea;
      border-radius: 8px;
      padding: 14px 16px;
      color: #53657a;
      font-size: 18px;
    }
    .search button {
      border: 0;
      border-radius: 8px;
      color: #ffffff;
      background: #075fac;
      font-size: 18px;
      font-weight: 700;
    }
    .result {
      border: 1px solid #d9e6f2;
      border-radius: 12px;
      padding: 18px;
      background: #f8fbff;
    }
    .result h2 {
      margin: 0 0 10px;
      color: #17202a;
      font-size: 28px;
      line-height: 1.2;
    }
    .result p {
      margin: 0 0 10px;
      color: #53657a;
      font-size: 18px;
      line-height: 1.42;
    }
    .actions {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 18px;
    }
    .actions span {
      border-radius: 8px;
      padding: 11px 8px;
      color: #ffffff;
      background: #0a73c0;
      text-align: center;
      font-size: 15px;
      font-weight: 700;
    }
  `;
}

function screenshotHtml(item) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>${baseStyles()}</style>
      </head>
      <body>
        <main class="frame">
          <section>
            <div class="brand">
              <img src="${logoSrc}" alt="">
              <div>
                <strong>Xinji Pet Food</strong>
                <span>B2B OEM Product Link</span>
              </div>
            </div>
            <h1>${item.title}</h1>
            <p class="subtitle">${item.subtitle}</p>
            <div class="keywords">
              <span>pet food OEM</span>
              <span>pet food</span>
              <span>pet supplements</span>
              <span>animal health</span>
              <span>pet export</span>
            </div>
          </section>
          <section class="panel">
            <div class="search">
              <div>Search product, ingredient or category</div>
              <button>Search</button>
            </div>
            <div class="result">
              <h2>${item.hero}</h2>
              ${item.cards.map((line) => `<p>${line}</p>`).join("")}
              <div class="actions">
                <span>Open</span>
                <span>Favorite</span>
                <span>Compare</span>
                <span>Export</span>
              </div>
            </div>
          </section>
        </main>
      </body>
    </html>
  `;
}

function promoHtml(width, height, variant) {
  const isSmall = width === 440;
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
            font-family: Arial, Helvetica, sans-serif;
            color: #ffffff;
            background: linear-gradient(135deg, #075fac 0%, #22b8f0 100%);
          }
          .wrap {
            display: grid;
            ${isSmall ? "grid-template-columns: 112px 1fr;" : "grid-template-columns: 260px 1fr;"}
            align-items: center;
            gap: ${isSmall ? "18px" : "54px"};
            width: 100%;
            height: 100%;
            padding: ${isSmall ? "28px" : "64px 92px"};
          }
          img {
            width: ${isSmall ? "104px" : "220px"};
            height: ${isSmall ? "104px" : "220px"};
            border-radius: ${isSmall ? "24px" : "46px"};
            background: #ffffff;
            box-shadow: 0 22px 50px rgba(0, 43, 91, 0.22);
          }
          h1 {
            margin: 0 0 ${isSmall ? "8px" : "18px"};
            font-size: ${isSmall ? "28px" : "68px"};
            line-height: 1.04;
            letter-spacing: 0;
          }
          p {
            margin: 0;
            max-width: ${isSmall ? "230px" : "760px"};
            font-size: ${isSmall ? "15px" : "30px"};
            line-height: 1.25;
          }
          .tag {
            display: inline-block;
            margin-top: ${isSmall ? "12px" : "32px"};
            border: 1px solid rgba(255,255,255,0.58);
            border-radius: 999px;
            padding: ${isSmall ? "6px 10px" : "12px 20px"};
            font-size: ${isSmall ? "12px" : "22px"};
            font-weight: 700;
          }
        </style>
      </head>
      <body>
        <main class="wrap">
          <img src="${logoSrc}" alt="">
          <section>
            <h1>${variant === "marquee" ? "Xinji Pet Food OEM Navigator" : "Pet Food OEM Link"}</h1>
            <p>Search products, compare ingredients and open verified Xinji official pages.</p>
            <span class="tag">pet food OEM · B2B sourcing</span>
          </section>
        </main>
      </body>
    </html>
  `;
}

async function renderPng(page, html, outputPath, width, height) {
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 0 });
  await page.screenshot({ path: outputPath, clip: { x: 0, y: 0, width, height } });
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  for (const item of screenshots) {
    await renderPng(page, screenshotHtml(item), path.join(outputDir, item.file), 1280, 800);
  }

  await renderPng(page, promoHtml(440, 280, "small"), path.join(outputDir, "small-promo-440x280.png"), 440, 280);
  await renderPng(page, promoHtml(1400, 560, "marquee"), path.join(outputDir, "marquee-promo-1400x560.png"), 1400, 560);

  await browser.close();
  console.log(`Generated assets in ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
