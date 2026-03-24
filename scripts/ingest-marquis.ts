import fs from 'fs';
import path from 'path';

const BASE_DIR = 'c:/dev2/My Web Sites/Marquis/www.marquisspas.com';
const PUBLIC_ASSETS = 'c:/dev2/public/assets/products';

const SERIES_MAP: Record<string, string> = {
  'celebrity': 'Celebrity Series',
  'marquis-elite-hot-tubs': 'Elite Series',
  'crown-series': 'Crown Series',
  'vector21-hot-tubs': 'Vector21 Series',
  'the-crown-collection': 'Crown Series'
};

interface ProductData {
  modelName: string;
  slug: string;
  seriesName: string;
  category: string;
  seatsMin: number | null;
  seatsMax: number | null;
  jetCount: number | null;
  dimensions: string | null;
  lengthIn: number | null;
  widthIn: number | null;
  depthIn: number | null;
  capacityGallons: number | null;
  dryWeightLbs: number | null;
  fullWeightLbs: number | null;
  pumpFlowGpm: number | null;
  electricalAmps: number | null;
  heroImageUrl: string | null;
  overheadImageUrl: string | null;
  marketingSummary: string | null;
  therapySummary: string | null;
  standardFeatures: string[];
  optionalFeatures: string[];
  shellColors: string[];
  cabinetColors: string[];
  usageTags: string[];
}

function parseModelPage(htmlPath: string, seriesName: string, category: string): ProductData | null {
  const content = fs.readFileSync(htmlPath, 'utf8');
  
  // Basic Regex parsers
  const nameMatch = content.match(/<h1>(.*?)<\/h1>/);
  if (!nameMatch) return null;
  let modelName = nameMatch[1].trim()
    .replace(/^Crown Series\s+/i, '')
    .replace(/^Celebrity\s+/i, '')
    .replace(/\s+Elite$/i, '')
    .replace(/\s+Series$/i, '');
  
  // Title Case normalization
  modelName = modelName.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  const slug = `marquis-${seriesName.toLowerCase().replace(/\s+series/i, '').replace(/\s+/g, '-')}-${modelName.toLowerCase().replace(/\s+/g, '-')}`;

  // Marketing Summary
  const summaryMatch = content.match(/<section class="spotlight lightText padd">[\s\S]*?<p>([\s\S]*?)<\/p>/);
  const marketingSummary = summaryMatch ? summaryMatch[1].replace(/<[^>]*>?/gm, '').trim() : null;

  // Specs Table Extraction (Robust version)
  const getSpec = (labels: string[]) => {
    for (const label of labels) {
      // Look for <td><strong>Label[:]</strong></td> <td>Value</td>
      // This handles various nesting and optional colons
      const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`<td[^>]*>\\s*(?:<strong>)?\\s*${escapedLabel}\\s*:?\\s*(?:<\\/strong>)?\\s*<\\/td>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>`, "i");
      const match = content.match(regex);
      if (match) return match[1].replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
      
      // Fallback: search for label text anywhere in a TD, then get next TD
      const fallbackRegex = new RegExp(`<td[^>]*>[^<]*${escapedLabel}[^<]*<\\/td>\\s*<td[^>]*>([\\s\\S]*?)<\\/td>`, "i");
      const fallbackMatch = content.match(fallbackRegex);
      if (fallbackMatch) {
         const val = fallbackMatch[1].replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
         if (val.toLowerCase() !== label.toLowerCase() && val.length > 0) return val;
      }
    }
    return null;
  };

  const dimensions = getSpec(['size', 'dimensions']);
  const jetsStr = getSpec(['jets']);
  const jetCount = jetsStr ? parseInt(jetsStr.replace(/[^\d]/g, '')) : null;
  const seatsStr = getSpec(['Massage Seats', 'capacity/seating', 'seating capacity', 'seating']);
  
  let seatsMax: number | null = null;
  let seatsMin: number | null = null;
  if (seatsStr) {
    const parts = seatsStr.split(/[\-\/]/);
    if (parts.length > 1) {
      seatsMin = parseInt(parts[0].trim().replace(/[^\d]/g, ''));
      seatsMax = parseInt(parts[parts.length - 1].trim().replace(/[^\d]/g, ''));
    } else {
      const match = seatsStr.match(/\d+/);
      if (match) {
        seatsMax = parseInt(match[0]);
        seatsMin = seatsMax;
      }
    }
  }
  
  const capacityStr = getSpec(['water capacity']);
  const capacityGallons = capacityStr ? parseInt(capacityStr.replace(/[^\d]/g, '')) : null;
  
  const weightStr = getSpec(['weight dry\/full', 'weight dry and full']);
  let dryWeightLbs: number | null = null;
  let fullWeightLbs: number | null = null;
  if (weightStr) {
    const parts = weightStr.split(/[\/]/);
    dryWeightLbs = parseInt(parts[0].replace(/[^\d]/g, ''));
    if (parts.length > 1) {
      fullWeightLbs = parseInt(parts[1].replace(/[^\d]/g, ''));
    }
  }

  // Dimensions parsing
  let lengthIn: number | null = null, widthIn: number | null = null, depthIn: number | null = null;
  if (dimensions) {
    // Handle formats like 90 x 90 x 36 or 77" x 77" x 36"
    const dParts = dimensions.match(/([\d\.]+)"?\s*[xX]\s*([\d\.]+)"?\s*[xX]\s*([\d\.]+)"?/);
    if (dParts) {
      lengthIn = parseFloat(dParts[1]);
      widthIn = parseFloat(dParts[2]);
      depthIn = parseFloat(dParts[3]);
    }
  }

  // Images
  const heroMatch = content.match(/<div class="imageContain">[\s\S]*?<img src="(.*?)"/);
  const overheadMatch = content.match(/<section class="spotlight videoWhite">[\s\S]*?<img src='(.*?)'/);
  
  let heroImageUrl = heroMatch ? heroMatch[1] : null;
  let overheadImageUrl = overheadMatch ? overheadMatch[1] : null;

  // Cleanup Image URLs (remove query params and resolve relative)
  const cleanImg = (url: string | null) => {
    if (!url) return null;
    return url.split('?')[0].replace(/&amp;/g, '&');
  };
  
  heroImageUrl = cleanImg(heroImageUrl);
  overheadImageUrl = cleanImg(overheadImageUrl);

  // Localize Images
  const targetFolder = path.join(PUBLIC_ASSETS, slug);
  if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder, { recursive: true });

  const localize = (src: string | null, type: string) => {
    if (!src) return null;
    const ext = path.extname(src.split('?')[0]) || '.jpg';
    const filename = `${type}${ext}`;
    const absoluteSrc = path.resolve(path.dirname(htmlPath), src);
    if (fs.existsSync(absoluteSrc)) {
      fs.copyFileSync(absoluteSrc, path.join(targetFolder, filename));
      return `/mcp/demo/assets/products/${slug}/${filename}`;
    }
    return null;
  };

  const localHero = localize(heroImageUrl, 'hero');
  const localOverhead = localize(overheadImageUrl, 'overhead');

  // Features
  const featuresSectionMatch = content.match(/<td><strong>STANDARD FEATURES<\/strong><\/td>[\s\S]*?<ul>([\s\S]*?)<\/ul>/);
  const standardFeatures = featuresSectionMatch ? 
    [...featuresSectionMatch[1].matchAll(/<li>(.*?)<\/li>/g)].map(m => m[1].replace(/<[^>]*>?/gm, '').trim()) : [];

  const optionsSectionMatch = content.match(/<td><strong>POPULAR OPTIONS<\/strong><\/td>[\s\S]*?<ul>([\s\S]*?)<\/ul>/);
  const optionalFeatures = optionsSectionMatch ? 
    [...optionsSectionMatch[1].matchAll(/<li>(.*?)<\/li>/g)].map(m => m[1].replace(/<[^>]*>?/gm, '').trim()) : [];

  return {
    modelName,
    slug,
    seriesName,
    category,
    seatsMin: seatsMax, // Simplification
    seatsMax,
    jetCount,
    dimensions,
    lengthIn,
    widthIn,
    depthIn,
    capacityGallons,
    dryWeightLbs,
    fullWeightLbs,
    pumpFlowGpm: null, // Hard to extract reliably from just text
    electricalAmps: 50, // Common default
    heroImageUrl: localHero,
    overheadImageUrl: localOverhead,
    marketingSummary,
    therapySummary: null,
    standardFeatures,
    optionalFeatures,
    shellColors: (seriesName.includes('Celebrity') || seriesName.includes('Elite')) ? ["Midnight Canyon", "Glacier", "Sterling Silver", "Tuscan Sun"] : ["Alba", "Midnight Canyon", "Glacier", "Sterling Silver", "Tuscan Sun", "Winter Solstice"],
    cabinetColors: seriesName.includes('Vector') ? ["Barnwood", "Chestnut", "Black DuraCovers® (Standard)", "Black Weathershield (Optional)"] : 
                  (seriesName.includes('Celebrity') ? ["Ash", "Pecan", "Black Weathershield (Optional)"] : 
                  (seriesName.includes('Elite') ? ["Harbor", "Hickory", "Granite", "Black Weathershield (Optional)"] : 
                  ["Granite", "Timber", "Island Tropical", "Black DuraCovers® (Standard)", "Black Weathershield (Optional)"])),
    usageTags: []
  };
}

async function ingest() {
  const allProducts: ProductData[] = [];
  
  // Hot Tubs
  const hotTubModelsRoot = path.join(BASE_DIR, 'hot-tubs/models');
  if (fs.existsSync(hotTubModelsRoot)) {
    const seriesFolders = fs.readdirSync(hotTubModelsRoot);
    for (const folder of seriesFolders) {
      const seriesPath = path.join(hotTubModelsRoot, folder);
      if (fs.statSync(seriesPath).isDirectory()) {
         const seriesName = SERIES_MAP[folder] || folder;
         // Check for subfolders (individual models)
         const models = fs.readdirSync(seriesPath);
         for (const modelFolder of models) {
           const modelPath = path.join(seriesPath, modelFolder);
           if (fs.statSync(modelPath).isDirectory()) {
             const indexPath = path.join(modelPath, 'index.html');
             if (fs.existsSync(indexPath)) {
                // Peek if it's a redirect
                const content = fs.readFileSync(indexPath, 'utf8');
                if (content.includes('Refresh') || content.includes('Page has moved')) continue;

                const data = parseModelPage(indexPath, seriesName, 'hot_tub');
                if (data) allProducts.push(data);
             }
           }
         }
      }
    }
  }

  // Swim Spas
  const swimSpaRoot = path.join(BASE_DIR, 'swim-spas');
  if (fs.existsSync(swimSpaRoot)) {
    const folders = fs.readdirSync(swimSpaRoot);
    for (const folder of folders) {
      const modelPath = path.join(swimSpaRoot, folder);
      if (fs.statSync(modelPath).isDirectory()) {
        const indexPath = path.join(modelPath, 'index.html');
        if (fs.existsSync(indexPath)) {
           const data = parseModelPage(indexPath, 'Swim Spas', 'swim_spa');
           if (data) allProducts.push(data);
        }
      }
    }
  }

  fs.writeFileSync('prisma/marquis-products.json', JSON.stringify(allProducts, null, 2));
  console.log(`Ingested ${allProducts.length} products to prisma/marquis-products.json`);
}

ingest().catch(console.error);
