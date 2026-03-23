export interface AestheticMapping {
  shell: string[];
  cabinet: string[];
}

export const AESTHETIC_MAPPINGS: Record<string, Record<string, AestheticMapping>> = {
  crown: {
    modern: {
      shell: ['Midnight Canyon', 'Glacier', 'Winter Solstice', 'Sterling Silver', 'Granite'],
      cabinet: ['Black DuraCovers®', 'Black Weathershield', 'Granite']
    },
    rustic: {
      shell: ['Tuscan Sun'],
      cabinet: ['Timber', 'Island Tropical']
    },
    tropical: {
      shell: ['Tuscan Sun', 'Alba'],
      cabinet: ['Timber']
    },
    classic: {
      shell: ['Alba', 'Sterling Silver', 'Granite'],
      cabinet: ['Granite']
    }
  },
  vector: {
    modern: {
      shell: ['Midnight Canyon', 'Glacier', 'Winter Solstice', 'Sterling Silver'],
      cabinet: ['Black DuraCovers®', 'Black Weathershield']
    },
    rustic: {
      shell: ['Tuscan Sun'],
      cabinet: ['Barnwood', 'Chestnut']
    },
    tropical: {
      shell: ['Tuscan Sun', 'Alba'],
      cabinet: ['Barnwood'] // Assuming Barnwood/Chestnut for tropical if not specified? User didn't specify cabinet for Vector Tropical.
    },
    classic: {
      shell: ['Alba', 'Sterling Silver', 'Glacier'],
      cabinet: ['Barnwood', 'Chestnut'] // Assuming neutral/balanced
    }
  },
  celebrity: {
    modern: {
      shell: ['Midnight Canyon', 'Glacier', 'Sterling Silver'],
      cabinet: ['Black Weathershield']
    },
    rustic: {
      shell: ['Tuscan Sun'],
      cabinet: ['Pecan']
    },
    tropical: {
      shell: ['Tuscan Sun'],
      cabinet: ['Pecan'] // From user notes: "Tuscan Sun carries more weight"
    },
    classic: {
      shell: ['Ash', 'Glacier', 'Sterling Silver'],
      cabinet: ['Ash']
    }
  },
  elite: {
    modern: {
      shell: ['Midnight Canyon', 'Glacier', 'Winter Solstice', 'Sterling Silver'],
      cabinet: ['Black Weathershield']
    },
    rustic: {
      shell: ['Tuscan Sun'],
      cabinet: ['Hickory']
    },
    tropical: {
      shell: ['Alba', 'Tuscan Sun'],
      cabinet: ['Hickory'] // Hickory or Pecan? User said Hickory is most distinct rustic.
    },
    classic: {
      shell: ['Alba', 'Sterling Silver', 'Glacier'],
      cabinet: ['Harbor', 'Granite']
    }
  }
};

export function getAestheticTitle(key: string): string {
  const titles: Record<string, string> = {
    modern: 'Sleek & Modern',
    rustic: 'Warm & Rustic',
    tropical: 'Island Tropical',
    classic: 'Timeless Classic'
  };
  return titles[key] || 'Your Aesthetic';
}

export const FINISH_IMAGE_MAP: Record<string, string> = {
  'Alba': '/mcp/demo/assets/finishes/alba.jpg',
  'Midnight Canyon': '/mcp/demo/assets/finishes/midnight-canyon.jpg',
  'Glacier': '/mcp/demo/assets/finishes/glacier.jpg',
  'Sterling Silver': '/mcp/demo/assets/finishes/sterling-silver.jpg',
  'Tuscan Sun': '/mcp/demo/assets/finishes/tuscan-sun.jpg',
  'Winter Solstice': '/mcp/demo/assets/finishes/winter-solstice.jpg',
  'Ash': '/mcp/demo/assets/finishes/ash.png',
  'Granite': '/mcp/demo/assets/finishes/granite.jpg',
  'Timber': '/mcp/demo/assets/finishes/timber.jpg',
  'Island Tropical': '/mcp/demo/assets/finishes/timber.jpg', // Fallback
  'Black DuraCovers®': '/mcp/demo/assets/finishes/black-duracovers.jpg',
  'Black Weathershield': '/mcp/demo/assets/finishes/black-weathershield.jpg',
  'Barnwood': '/mcp/demo/assets/finishes/barnwood.jpg',
  'Chestnut': '/mcp/demo/assets/finishes/chestnut.jpg',
  'Pecan': '/mcp/demo/assets/finishes/pecan.png',
  'Hickory': '/mcp/demo/assets/finishes/hickory.png',
  'Harbor': '/mcp/demo/assets/finishes/harbor.png'
};
