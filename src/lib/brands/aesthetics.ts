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
