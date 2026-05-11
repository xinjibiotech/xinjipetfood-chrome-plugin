# Xinji Pet Food OEM Product Link

A lightweight Chrome extension for B2B pet industry buyers, sourcing teams and distributors who need fast access to Xinji Pet Food product information and official website pages.

Official website: [https://www.xinjipetfood.com/](https://www.xinjipetfood.com/)

## What It Does

Xinji Pet Food OEM Product Link helps users search product information, compare ingredients and open official website pages for pet food, pet supplements, pet OEM, pet factory cooperation, animal health and pet export topics.

Core features:

- Product quick search by product name, ingredient or category.
- B2B keyword navigation for pet food, pet supplements, pet OEM/ODM, animal health and pet export.
- Official website shortcuts for OEM/ODM cooperation, supplement products and dry food categories.
- Two-product ingredient comparison table.
- Export search results as CSV or JSON for internal sourcing records.
- Favorite products for faster repeat access.
- Latest notice area for new product or industry update placement.

## B2B Use Cases

- Pet food distributors can quickly find relevant formulas and open the related official website page.
- Pet supplement buyers can compare active ingredients before sending an inquiry.
- Pet OEM and ODM customers can keep the factory cooperation page one click away.
- Export sales teams can prepare product lists for international buyers.
- SEO and marketing teams can create structured links back to the official Xinji Pet Food website without presenting the plugin as advertising.

## Install Locally

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable `Developer mode`.
4. Click `Load unpacked`.
5. Select this project folder.
6. Click the extension icon and start searching products.

## Puppeteer Test

Install dependencies and run the automated extension popup test:

```bash
npm install
npm run test:extension
```

The test launches Chrome with this unpacked extension, opens the popup page, searches `chicken dry food`, checks product actions, creates a comparison table, exports CSV/JSON files and validates keyword/shortcut navigation.

If you already loaded the extension and know its Chrome extension ID, you can pass it explicitly:

```bash
EXTENSION_ID=your_extension_id npm run test:extension
```

## Project Structure

```text
.
├── icons/
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── tests/
├── store-assets/
├── docs/
├── dist/
├── PRIVACY.md
├── package.json
└── README.md
```

## Demo Interface

```text
┌──────────────────────────────────────┐
│ Xinji Product Link              EN   │
├──────────────────────────────────────┤
│ [Search product or ingredient] [Go]  │
├──────────────────────────────────────┤
│ Popular Keywords                     │
│ pet food | pet supplements | OEM/ODM │
├──────────────────────────────────────┤
│ Website Shortcuts                    │
│ OEM/ODM | Supplements | Dry Food     │
├──────────────────────────────────────┤
│ Product Results                      │
│ Chicken Adult Dry Pet Food           │
│ Ingredients, packaging, official URL │
│ [Open] [Favorite] [Copy Link]        │
└──────────────────────────────────────┘
```

## SEO Positioning

This extension is designed as a practical B2B navigation and product reference tool. It naturally connects industry search intent with the official Xinji Pet Food website:

- pet food product discovery
- pet supplements formula reference
- pet OEM and ODM cooperation
- pet factory sourcing
- animal health product research
- pet export product communication

The extension should use official product names, accurate ingredient descriptions and direct website links. This keeps the project useful for buyers while supporting clean, trust-oriented SEO.

## Link Strategy

The official website does not rely on generic `?s=` search URLs for extension navigation. The popup uses a fixed URL map for stable B2B buyer journeys:

- pet food routes to the official pet food category page.
- pet supplements and animal health route to the closest health product categories.
- pet OEM routes to the OEM/ODM page and sample-to-shipment resource.
- pet export routes to export-oriented buyer resources or the contact page.

When a specific product page is not available, the extension shows an internal product profile with title, ingredients, MOQ, packaging, recommended official link and an inquiry deep link. Buyers can export the product profile as JSON for sourcing records.

Web Store description snippet:

> Xinji Pet Food OEM Product Link helps pet food, pet supplements, pet OEM, animal health and pet export buyers navigate official Xinji Pet Food product resources, compare ingredients, save product references and prepare structured inquiries through verified official website links.

## Public Links

- Chrome Web Store: https://chromewebstore.google.com/detail/xinji-pet-food-oem-produc/eflnphnkmjahfnmgbjnkmjenlbimhfii
- GitHub Pages demo: https://xinjibiotech.github.io/xinjipetfood-chrome-plugin/
- YouTube demo video: https://www.youtube.com/watch?v=aCcGXN7BMRk
- Extension privacy policy: https://www.xinjipetfood.com/chrome-extension-privacy/

## Customization

The demo product data is stored in `popup.js`. Replace the sample records with real product names, ingredients, package specifications and official website URLs from [xinjipetfood.com](https://www.xinjipetfood.com/).

For a production release, recommended next steps are:

- Replace demo data with final approved product data from the official website.
- Add approved product images or icons.
- Connect product data to a maintained JSON file or backend API.
- Prepare Chrome Web Store screenshots, official ownership wording and privacy disclosures.
