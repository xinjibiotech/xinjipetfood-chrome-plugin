#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const puppeteer = require("puppeteer");

const projectRoot = path.resolve(__dirname, "..");
const extensionPath = projectRoot;
const downloadDir = path.join(projectRoot, "test-output", "downloads");
const websiteOrigin = "https://www.xinjipetfood.com/";

const results = [];

function logStep(name, ok, detail = "") {
  const status = ok ? "PASS" : "FAIL";
  const line = `[${status}] ${name}${detail ? ` - ${detail}` : ""}`;
  results.push({ name, ok, detail });
  console.log(line);
}

function assertStep(condition, name, detail = "") {
  if (!condition) {
    logStep(name, false, detail);
    throw new Error(`${name}${detail ? `: ${detail}` : ""}`);
  }
  logStep(name, true, detail);
}

async function waitForCreatedPage(browser, action, expectedUrlPart) {
  const targetPromise = browser.waitForTarget(
    (target) => target.type() === "page" && target.url().includes(expectedUrlPart),
    { timeout: 10000 }
  );
  await action();
  const target = await targetPromise;
  const page = await target.page();
  return page;
}

async function discoverExtensionId(browser, userDataDir) {
  const target = await browser.waitForTarget(
    (candidate) => candidate.type() === "background_page" || candidate.type() === "service_worker",
    { timeout: 10000 }
  ).catch(() => null);
  if (target) {
    const match = target.url().match(/^chrome-extension:\/\/([^/]+)/);
    if (match) return match[1];
  }

  const page = await browser.newPage();
  try {
    await page.goto("chrome://extensions/", { waitUntil: "domcontentloaded" });
    await page.waitForSelector("extensions-manager", { timeout: 5000 });
    await new Promise((resolve) => setTimeout(resolve, 500));
    const extensionId = await page.evaluate((expectedName) => {
      const manager = document.querySelector("extensions-manager");
      const itemList = manager && manager.shadowRoot && manager.shadowRoot.querySelector("extensions-item-list");
      const items = itemList && itemList.shadowRoot
        ? [...itemList.shadowRoot.querySelectorAll("extensions-item")]
        : [];
      const match = items.find((item) => {
        const data = item.data || {};
        return data.name === expectedName || item.id;
      });
      return match ? match.id : "";
    }, "Xinji Pet B2B Product Link");
    if (extensionId) return extensionId;
  } finally {
    await page.close().catch(() => {});
  }

  const preferencesPath = path.join(userDataDir, "Default", "Preferences");
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (fs.existsSync(preferencesPath)) {
      const preferences = JSON.parse(fs.readFileSync(preferencesPath, "utf8"));
      const settings = preferences.extensions && preferences.extensions.settings;
      if (settings) {
        const match = Object.entries(settings).find(([, value]) => {
          return value && value.path && path.resolve(value.path) === extensionPath;
        });
        if (match) return match[0];
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("Could not discover extension id from Chrome profile Preferences.");
}

async function setDownloadBehavior(page) {
  fs.mkdirSync(downloadDir, { recursive: true });
  fs.rmSync(downloadDir, { recursive: true, force: true });
  fs.mkdirSync(downloadDir, { recursive: true });

  const client = await page.target().createCDPSession();
  await client.send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadDir
  });
}

function waitForDownloadedFile(filename) {
  const targetPath = path.join(downloadDir, filename);
  return new Promise((resolve, reject) => {
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const exists = fs.existsSync(targetPath);
      const partialExists = fs.readdirSync(downloadDir).some((file) => file.endsWith(".crdownload"));
      if (exists && !partialExists) {
        clearInterval(timer);
        resolve(targetPath);
      }
      if (Date.now() - startedAt > 10000) {
        clearInterval(timer);
        reject(new Error(`Download not found: ${filename}`));
      }
    }, 200);
  });
}

async function clickByText(page, selector, text, occurrence = 0) {
  const handles = await page.$$(selector);
  const matches = [];
  for (const handle of handles) {
    const label = await page.evaluate((element) => element.textContent.trim(), handle);
    if (label === text) matches.push(handle);
  }
  if (!matches[occurrence]) {
    throw new Error(`Could not find ${selector} with text "${text}" at occurrence ${occurrence}.`);
  }
  await matches[occurrence].click();
}

async function run() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "xinji-extension-test-"));
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: false,
      pipe: true,
      enableExtensions: [extensionPath],
      userDataDir,
      defaultViewport: { width: 480, height: 900 },
      args: [
        "--no-first-run",
        "--no-default-browser-check"
      ]
    });

    const extensionId = process.env.EXTENSION_ID || await discoverExtensionId(browser, userDataDir);
    const popupUrl = `chrome-extension://${extensionId}/popup.html`;
    const page = await browser.newPage();
    await setDownloadBehavior(page);
    await page.goto(popupUrl, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("#searchInput", { timeout: 10000 });
    logStep("Open extension popup", true, popupUrl);

    await page.type("#searchInput", "chicken dry food");
    await page.click("#searchButton");
    await page.waitForFunction(() => document.querySelectorAll(".product-card").length > 0);
    const firstResultTitle = await page.$eval(".product-card .product-title", (element) => element.textContent.trim());
    assertStep(firstResultTitle.includes("Chicken"), "Search chicken dry food", firstResultTitle);

    const openedProductPage = await waitForCreatedPage(
      browser,
      () => clickByText(page, ".product-card .card-actions button", "Open"),
      "xinjipetfood.com"
    );
    assertStep(
      openedProductPage.url().includes("/products/chicken-rice-formula-dog-food-adult-dogs/"),
      "Open first product",
      openedProductPage.url()
    );
    await openedProductPage.close();

    await clickByText(page, ".product-card .card-actions button", "Favorite");
    await page.waitForFunction(() => document.querySelector("#favoriteCount").textContent === "1");
    assertStep(true, "Favorite first product", "favorite count is 1");

    await clickByText(page, ".product-card .card-actions button", "Copy Link");
    await page.waitForFunction(() => {
      const buttons = [...document.querySelectorAll(".product-card .card-actions button")];
      return buttons.some((button) => button.textContent.trim() === "Copied");
    });
    assertStep(true, "Copy first product link", "button changed to Copied");

    await page.click("#searchInput", { clickCount: 3 });
    await page.keyboard.press("Backspace");
    await page.click("#searchButton");
    await page.waitForFunction(() => document.querySelectorAll(".product-card").length >= 2);
    const checkboxes = await page.$$(".product-card input[type='checkbox']");
    await checkboxes[0].click();
    await checkboxes[1].click();
    await page.click("#compareButton");
    await page.waitForSelector("#comparePanel:not([hidden]) .compare-table");
    const compareRows = await page.$$eval(".compare-table tr", (rows) => rows.length);
    assertStep(compareRows >= 5, "Generate ingredient comparison", `${compareRows} rows`);

    await page.click("#exportCsvButton");
    const csvPath = await waitForDownloadedFile("xinji-pet-products.csv");
    assertStep(fs.statSync(csvPath).size > 0, "Export CSV", csvPath);

    await page.click("#exportJsonButton");
    const jsonPath = await waitForDownloadedFile("xinji-pet-products.json");
    const jsonPayload = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    assertStep(Array.isArray(jsonPayload) && jsonPayload.length >= 2, "Export JSON", `${jsonPayload.length} products`);

    await clickByText(page, ".product-card .card-actions button", "Details");
    await page.waitForSelector("#fallbackModal:not([hidden])");
    const fallbackTitle = await page.$eval("#fallbackTitle", (element) => element.textContent.trim());
    assertStep(Boolean(fallbackTitle), "Open internal product detail", fallbackTitle);
    await page.click("#fallbackExportButton");
    const profilePath = await waitForDownloadedFile("dry-chicken-adult-profile.json");
    assertStep(fs.statSync(profilePath).size > 0, "Export product profile", profilePath);
    await page.click("#closeFallbackButton");

    const keywordPage = await waitForCreatedPage(
      browser,
      () => clickByText(page, "#keywordList button", "pet food"),
      "xinjipetfood.com"
    );
    assertStep(keywordPage.url().includes("/products/pet-food/"), "Keyword navigation", keywordPage.url());
    await keywordPage.close();

    const shortcutPage = await waitForCreatedPage(
      browser,
      () => clickByText(page, "#shortcutList button", "OEM/ODM"),
      "xinjipetfood.com"
    );
    assertStep(shortcutPage.url().includes("/oem-odm/"), "Website shortcut navigation", shortcutPage.url());
    await shortcutPage.close();

    const sitemapPage = await waitForCreatedPage(
      browser,
      () => clickByText(page, "#sitemapList button", "Contact"),
      "xinjipetfood.com"
    );
    assertStep(sitemapPage.url().includes("/contact/"), "Sitemap navigation", sitemapPage.url());
    await sitemapPage.close();

    const failed = results.filter((result) => !result.ok);
    console.log(`\nExtension test completed: ${results.length - failed.length}/${results.length} passed.`);
    if (failed.length) process.exitCode = 1;
  } catch (error) {
    console.error(`\nTest stopped: ${error.message}`);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
  }
}

run();
