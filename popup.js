const WEBSITE = "https://www.xinjipetfood.com/";

const officialRoutes = {
  home: `${WEBSITE}`,
  products: `${WEBSITE}products/`,
  petFood: `${WEBSITE}products/pet-food/`,
  petHealthProducts: `${WEBSITE}products/pet-health-products/`,
  veterinaryCare: `${WEBSITE}products/pet-veterinary-care/`,
  oemOdm: `${WEBSITE}oem-odm/`,
  customFormula: `${WEBSITE}oem-odm/#custom-formula`,
  packagingDesign: `${WEBSITE}oem-odm/#packaging-design`,
  factoryTour: `${WEBSITE}factory-tour/`,
  quality: `${WEBSITE}quality-certifications/`,
  applications: `${WEBSITE}applications/`,
  petStores: `${WEBSITE}applications/pet-stores/`,
  veterinaryClinics: `${WEBSITE}applications/veterinary-clinics/`,
  exportAuditGuide: `${WEBSITE}blog/pet-food-factory-audit-checklist-bulk-buyers/`,
  treatSourcingGuide: `${WEBSITE}blog/pet-treat-sourcing-guide-functional-snacks/`,
  sampleToShipment: `${WEBSITE}blog/oem-pet-food-sample-to-shipment-process/`,
  contact: `${WEBSITE}contact/`
};

// Keyword links use verified, fixed website routes instead of unsupported `?s=` search URLs.
// When the official site does not have a specific page, fallbackType decides whether
// the extension opens a close category page, internal product detail, sitemap or contact flow.
const keywordRoutes = [
  {
    label: "pet food",
    primaryUrl: officialRoutes.petFood,
    fallbackUrl: officialRoutes.products,
    fallbackType: "category"
  },
  {
    label: "pet supplements",
    primaryUrl: officialRoutes.petHealthProducts,
    fallbackUrl: officialRoutes.products,
    fallbackType: "category"
  },
  {
    label: "pet OEM/ODM",
    primaryUrl: officialRoutes.oemOdm,
    fallbackUrl: officialRoutes.sampleToShipment,
    fallbackType: "resource"
  },
  {
    label: "animal health",
    primaryUrl: officialRoutes.veterinaryCare,
    fallbackUrl: officialRoutes.petHealthProducts,
    fallbackType: "category"
  },
  {
    label: "pet export",
    primaryUrl: officialRoutes.exportAuditGuide,
    fallbackUrl: officialRoutes.contact,
    fallbackType: "contact"
  }
];

const shortcutRoutes = [
  { label: "OEM/ODM", primaryUrl: officialRoutes.oemOdm, fallbackUrl: officialRoutes.contact, fallbackType: "contact" },
  { label: "Supplements", primaryUrl: officialRoutes.petHealthProducts, fallbackUrl: officialRoutes.products, fallbackType: "category" },
  { label: "Dry Food", primaryUrl: officialRoutes.petFood, fallbackUrl: officialRoutes.products, fallbackType: "category" },
  { label: "Factory", primaryUrl: officialRoutes.factoryTour, fallbackUrl: officialRoutes.quality, fallbackType: "resource" },
  { label: "Contact", primaryUrl: officialRoutes.contact, fallbackUrl: officialRoutes.home, fallbackType: "contact" }
];

const sitemapLinks = [
  { label: "Products", url: officialRoutes.products },
  { label: "Pet Food", url: officialRoutes.petFood },
  { label: "Pet Health", url: officialRoutes.petHealthProducts },
  { label: "OEM/ODM", url: officialRoutes.oemOdm },
  { label: "Factory Tour", url: officialRoutes.factoryTour },
  { label: "Quality", url: officialRoutes.quality },
  { label: "Contact", url: officialRoutes.contact }
];

const products = [
  {
    id: "dry-chicken-adult",
    name: "Chicken Adult Dry Pet Food",
    category: "pet food",
    ingredients: ["chicken meal", "rice", "fish oil", "vitamins", "minerals"],
    moq: "Negotiable by formula and packaging plan",
    packaging: "1kg / 2.5kg / 10kg / OEM bag",
    url: `${WEBSITE}products/chicken-rice-formula-dog-food-adult-dogs/`,
    fallbackUrl: officialRoutes.petFood
  },
  {
    id: "salmon-cat-food",
    name: "Salmon Cat Food Formula",
    category: "pet food",
    ingredients: ["salmon", "pea protein", "taurine", "omega 3", "prebiotics"],
    moq: "Private label MOQ depends on package size",
    packaging: "500g / 1.5kg / private label pack",
    url: "",
    fallbackUrl: officialRoutes.petFood
  },
  {
    id: "joint-supplement",
    name: "Joint Care Pet Supplement",
    category: "pet supplements",
    ingredients: ["glucosamine", "chondroitin", "MSM", "collagen"],
    moq: "Available for OEM bottle or soft chew packaging",
    packaging: "60 tablets / 120 tablets / OEM bottle",
    url: `${WEBSITE}products/dog-advanced-joint-mobility-support-soft-chews/`,
    fallbackUrl: officialRoutes.petHealthProducts
  },
  {
    id: "probiotic-powder",
    name: "Pet Probiotic Powder",
    category: "animal health",
    ingredients: ["probiotics", "inulin", "yeast extract", "zinc"],
    moq: "Sample and export carton options available by inquiry",
    packaging: "2g sachet / 100g jar / export carton",
    url: `${WEBSITE}products/dog-probiotic-digestive-support-soft-chews/`,
    fallbackUrl: officialRoutes.petHealthProducts
  },
  {
    id: "oem-odm-service",
    name: "Pet OEM/ODM Manufacturing Service",
    category: "pet OEM/ODM",
    ingredients: ["formula development", "private label", "packaging design", "export support"],
    moq: "MOQ by formula and package type",
    packaging: "MOQ by formula and package type",
    url: `${WEBSITE}oem-odm/`,
    fallbackUrl: officialRoutes.contact
  }
];

const labels = {
  searchPlaceholder: "Search product, ingredient or category",
  search: "Search",
  compare: "Compare",
  favorite: "Favorite",
  saved: "Saved",
  open: "Open",
  details: "Details",
  noResults: "No matching products. Try pet food, supplement, chicken or OEM.",
  compareHint: "Select exactly two products for comparison."
};

let currentResults = [...products];
let selectedProductIds = new Set();
let favorites = new Set();

const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const resultList = document.querySelector("#resultList");
const resultCount = document.querySelector("#resultCount");
const keywordList = document.querySelector("#keywordList");
const shortcutList = document.querySelector("#shortcutList");
const sitemapList = document.querySelector("#sitemapList");
const compareButton = document.querySelector("#compareButton");
const comparePanel = document.querySelector("#comparePanel");
const compareTable = document.querySelector("#compareTable");
const closeCompareButton = document.querySelector("#closeCompareButton");
const exportCsvButton = document.querySelector("#exportCsvButton");
const exportJsonButton = document.querySelector("#exportJsonButton");
const favoriteList = document.querySelector("#favoriteList");
const favoriteCount = document.querySelector("#favoriteCount");
const fallbackModal = document.querySelector("#fallbackModal");
const fallbackTitle = document.querySelector("#fallbackTitle");
const fallbackBody = document.querySelector("#fallbackBody");
const closeFallbackButton = document.querySelector("#closeFallbackButton");
const fallbackContactButton = document.querySelector("#fallbackContactButton");
const fallbackExportButton = document.querySelector("#fallbackExportButton");

let activeFallbackProduct = null;

function t(key) {
  return labels[key] || key;
}

function normalize(value) {
  return value.toLowerCase().trim();
}

function productHaystack(product) {
  return normalize([
    product.name,
    product.category,
    product.packaging,
    product.ingredients.join(" ")
  ].join(" "));
}

function searchProducts() {
  const query = normalize(searchInput.value);
  const terms = query.split(/\s+/).filter(Boolean);
  currentResults = query
    ? products.filter((product) => {
      const haystack = productHaystack(product);
      return terms.every((term) => haystack.includes(term));
    })
    : [...products];
  selectedProductIds = new Set(
    [...selectedProductIds].filter((id) => currentResults.some((product) => product.id === id))
  );
  renderResults();
}

function openOfficialLink(url) {
  window.open(url, "_blank", "noopener");
}

function isUsableOfficialUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.origin === new URL(WEBSITE).origin && !parsed.searchParams.has("s");
  } catch {
    return false;
  }
}

function buildProductDeepLink(product) {
  const params = new URLSearchParams({
    source: "xinji-extension",
    product: product.id,
    category: product.category
  });
  return `${officialRoutes.contact}#product-inquiry?${params.toString()}`;
}

function openRoute(route) {
  if (isUsableOfficialUrl(route.primaryUrl)) {
    openOfficialLink(route.primaryUrl);
    return;
  }
  if (isUsableOfficialUrl(route.fallbackUrl)) {
    openOfficialLink(route.fallbackUrl);
    return;
  }
  showSitemapFallback(route.label, route.fallbackType);
}

function openProduct(product) {
  if (isUsableOfficialUrl(product.url)) {
    openOfficialLink(product.url);
    return;
  }
  if (isUsableOfficialUrl(product.fallbackUrl)) {
    showProductFallback(product, {
      reason: "This product does not yet have a dedicated official page.",
      officialUrl: product.fallbackUrl,
      deepLink: buildProductDeepLink(product)
    });
    return;
  }
  showProductFallback(product, {
    reason: "Official product URL is not configured.",
    officialUrl: officialRoutes.contact,
    deepLink: buildProductDeepLink(product)
  });
}

function showSitemapFallback(label, fallbackType) {
  activeFallbackProduct = null;
  fallbackTitle.textContent = `${label} links`;
  fallbackBody.innerHTML = `
    <p class="product-meta">No dedicated page is configured for this ${escapeHtml(fallbackType)} route. Use the closest official resource below.</p>
    ${sitemapLinks.map((link) => `
      <div class="fallback-item">
        <strong>${escapeHtml(link.label)}</strong>
        <span>${escapeHtml(link.url)}</span>
      </div>
    `).join("")}
  `;
  fallbackModal.hidden = false;
}

function showProductFallback(product, context = {}) {
  activeFallbackProduct = product;
  fallbackTitle.textContent = product.name;
  fallbackBody.innerHTML = `
    <p class="product-meta">${escapeHtml(context.reason || "Product details are available inside the extension.")}</p>
    <div class="fallback-item">
      <strong>Category</strong>
      <span>${escapeHtml(product.category)}</span>
    </div>
    <div class="fallback-item">
      <strong>Ingredients</strong>
      <span>${escapeHtml(product.ingredients.join(", "))}</span>
    </div>
    <div class="fallback-item">
      <strong>Packaging</strong>
      <span>${escapeHtml(product.packaging)}</span>
    </div>
    <div class="fallback-item">
      <strong>MOQ</strong>
      <span>${escapeHtml(product.moq || "Confirm with the official sales team.")}</span>
    </div>
    <div class="fallback-item">
      <strong>Recommended official link</strong>
      <span>${escapeHtml(context.officialUrl || officialRoutes.contact)}</span>
    </div>
    <div class="fallback-item">
      <strong>Deep link for inquiry context</strong>
      <span>${escapeHtml(context.deepLink || buildProductDeepLink(product))}</span>
    </div>
  `;
  fallbackModal.hidden = false;
}

function createButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  if (className) button.className = className;
  button.addEventListener("click", onClick);
  return button;
}

function renderNavigation() {
  keywordList.innerHTML = "";
  keywordRoutes.forEach((keyword) => {
    keywordList.appendChild(createButton(keyword.label, "chip", () => openRoute(keyword)));
  });

  shortcutList.innerHTML = "";
  shortcutRoutes.forEach((shortcut) => {
    shortcutList.appendChild(createButton(shortcut.label, "shortcut", () => openRoute(shortcut)));
  });

  sitemapList.innerHTML = "";
  sitemapLinks.forEach((link) => {
    sitemapList.appendChild(createButton(link.label, "shortcut", () => openOfficialLink(link.url)));
  });
}

function renderResults() {
  resultList.innerHTML = "";
  resultCount.textContent = String(currentResults.length);

  if (!currentResults.length) {
    const empty = document.createElement("p");
    empty.className = "product-meta";
    empty.textContent = t("noResults");
    resultList.appendChild(empty);
    return;
  }

  currentResults.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const top = document.createElement("div");
    top.className = "product-top";

    const titleWrap = document.createElement("div");
    const title = document.createElement("div");
    title.className = "product-title";
    title.textContent = product.name;
    const meta = document.createElement("p");
    meta.className = "product-meta";
    meta.textContent = `${product.category} | ${product.packaging}`;
    titleWrap.append(title, meta);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = selectedProductIds.has(product.id);
    checkbox.setAttribute("aria-label", `Select ${product.name}`);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selectedProductIds.add(product.id);
      else selectedProductIds.delete(product.id);
    });

    top.append(titleWrap, checkbox);

    const ingredients = document.createElement("p");
    ingredients.className = "product-meta";
    ingredients.textContent = `Ingredients: ${product.ingredients.join(", ")}`;

    const actions = document.createElement("div");
    actions.className = "card-actions";

    const openButton = createButton(t("open"), "", () => openProduct(product));

    const favoriteButton = createButton(
      favorites.has(product.id) ? t("saved") : t("favorite"),
      "secondary",
      () => toggleFavorite(product.id)
    );
    const detailButton = createButton(t("details"), "secondary", () => showProductFallback(product));
    const copyButton = createButton("Copy Link", "secondary", async () => {
      await navigator.clipboard.writeText(product.url || product.fallbackUrl || buildProductDeepLink(product));
      copyButton.textContent = "Copied";
      setTimeout(() => {
        copyButton.textContent = "Copy Link";
      }, 1200);
    });

    actions.append(openButton, favoriteButton, detailButton, copyButton);
    card.append(top, ingredients, actions);
    resultList.appendChild(card);
  });
}

function getSelectedProducts() {
  return products.filter((product) => selectedProductIds.has(product.id));
}

function renderComparison() {
  const selected = getSelectedProducts();
  if (selected.length !== 2) {
    comparePanel.hidden = false;
    compareTable.innerHTML = `<p class="product-meta">${t("compareHint")}</p>`;
    return;
  }

  const rows = [
    ["Product", selected[0].name, selected[1].name],
    ["Category", selected[0].category, selected[1].category],
    ["Key Ingredients", selected[0].ingredients.join(", "), selected[1].ingredients.join(", ")],
    ["Packaging", selected[0].packaging, selected[1].packaging],
    [
      "Official Link",
      selected[0].url || selected[0].fallbackUrl || buildProductDeepLink(selected[0]),
      selected[1].url || selected[1].fallbackUrl || buildProductDeepLink(selected[1])
    ]
  ];

  comparePanel.hidden = false;
  compareTable.innerHTML = `
    <table class="compare-table">
      <tbody>
        ${rows.map((row) => `
          <tr>
            <th>${escapeHtml(row[0])}</th>
            <td>${escapeHtml(row[1])}</td>
            <td>${escapeHtml(row[2])}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadFavorites() {
  if (typeof chrome === "undefined" || !chrome.storage) {
    renderFavorites();
    renderResults();
    return;
  }
  const stored = await chrome.storage.local.get({ favorites: [] });
  favorites = new Set(stored.favorites);
  renderFavorites();
  renderResults();
}

async function toggleFavorite(productId) {
  if (favorites.has(productId)) favorites.delete(productId);
  else favorites.add(productId);
  if (typeof chrome !== "undefined" && chrome.storage) {
    await chrome.storage.local.set({ favorites: [...favorites] });
  }
  renderFavorites();
  renderResults();
}

function renderFavorites() {
  favoriteList.innerHTML = "";
  const favoriteProducts = products.filter((product) => favorites.has(product.id));
  favoriteCount.textContent = String(favoriteProducts.length);

  if (!favoriteProducts.length) {
    const empty = document.createElement("p");
    empty.className = "product-meta";
    empty.textContent = "No saved products yet.";
    favoriteList.appendChild(empty);
    return;
  }

  favoriteProducts.forEach((product) => {
    const item = document.createElement("div");
    item.className = "favorite-item";
    const name = document.createElement("span");
    name.textContent = product.name;
    const link = document.createElement("a");
    link.href = product.url || product.fallbackUrl || buildProductDeepLink(product);
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = t("open");
    item.append(name, link);
    favoriteList.appendChild(item);
  });
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function exportCsv() {
  const header = ["name", "category", "ingredients", "packaging", "official_url"];
  const rows = currentResults.map((product) => [
    product.name,
    product.category,
    product.ingredients.join("; "),
    product.packaging,
    product.url || product.fallbackUrl || buildProductDeepLink(product)
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  downloadFile("xinji-pet-products.csv", csv, "text/csv;charset=utf-8");
}

function exportJson() {
  const payload = currentResults.map((product) => ({
    name: product.name,
    category: product.category,
    ingredients: product.ingredients,
    packaging: product.packaging,
    moq: product.moq,
    officialUrl: product.url || product.fallbackUrl || buildProductDeepLink(product)
  }));
  downloadFile("xinji-pet-products.json", JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
}

function exportProductProfile(product) {
  if (!product) {
    showSitemapFallback("Official Sitemap", "sitemap");
    return;
  }
  const profile = {
    name: product.name,
    category: product.category,
    ingredients: product.ingredients,
    packaging: product.packaging,
    moq: product.moq,
    officialUrl: product.url || product.fallbackUrl || officialRoutes.contact,
    inquiryTemplate: `Hello Xinji Pet Food, I am interested in ${product.name}. Please share MOQ, lead time, packaging options and export documents.`
  };
  const filename = `${product.id}-profile.json`;
  downloadFile(filename, JSON.stringify(profile, null, 2), "application/json;charset=utf-8");
}

function applyLanguage() {
  searchInput.placeholder = t("searchPlaceholder");
  searchButton.textContent = t("search");
  compareButton.textContent = t("compare");
  renderResults();
  renderFavorites();
}

searchButton.addEventListener("click", searchProducts);
searchInput.addEventListener("input", searchProducts);
compareButton.addEventListener("click", renderComparison);
closeCompareButton.addEventListener("click", () => {
  comparePanel.hidden = true;
});
closeFallbackButton.addEventListener("click", () => {
  fallbackModal.hidden = true;
});
fallbackContactButton.addEventListener("click", () => {
  openOfficialLink(activeFallbackProduct ? buildProductDeepLink(activeFallbackProduct) : officialRoutes.contact);
});
fallbackExportButton.addEventListener("click", () => {
  exportProductProfile(activeFallbackProduct);
});
exportCsvButton.addEventListener("click", exportCsv);
exportJsonButton.addEventListener("click", exportJson);

renderNavigation();
applyLanguage();
loadFavorites();
