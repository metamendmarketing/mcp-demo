import { UserPreferences, scoreProducts } from './src/lib/recommendation/scoring';
import fs from 'fs';
import path from 'path';

const products = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'prisma/marquis-products.json'), 'utf8'));

const exerciseUser: UserPreferences = {
    primaryPurpose: 'exercise',
    capacity: '6',
    lounge: 'no',
    electrical: '240v',
    zipCode: '90210',
    sunExposure: 'partial',
    placement: 'outdoor',
    focus: 'performance',
    aesthetic: 'modern',
    maintenance: 'auto',
    intensity: 'high',
    budget: 'luxury',
    delivery: 'easy',
    ownership: 'upgrade'
};

const results = scoreProducts(products, exerciseUser);
console.log("Top 5 Results for Exercise/Luxury/6-seat:");
results.slice(0, 5).forEach((r, i) => {
    console.log(`${i+1}. ${r.product.modelName} (${r.product.seriesName}) - Score: ${r.score}%`);
    console.log(`   Reasons: ${r.reasons[0]}...`);
});

const socialUser: UserPreferences = {
    primaryPurpose: 'recreational',
    capacity: '8',
    lounge: 'no',
    electrical: '240v',
    zipCode: '90210',
    sunExposure: 'partial',
    placement: 'outdoor',
    focus: 'social',
    aesthetic: 'modern',
    maintenance: 'auto',
    intensity: 'medium',
    budget: 'luxury',
    delivery: 'easy',
    ownership: 'upgrade'
};

const socialResults = scoreProducts(products, socialUser);
console.log("\nTop 5 Results for Social/Luxury/8-seat:");
socialResults.slice(0, 5).forEach((r, i) => {
    console.log(`${i+1}. ${r.product.modelName} (${r.product.seriesName}) - Score: ${r.score}%`);
});
