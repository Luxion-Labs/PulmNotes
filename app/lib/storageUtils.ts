export const getStorageInfo = () => {
  if (typeof window === 'undefined') {
    return { used: 0, available: 0, percentage: 0, usedMB: '0', availableMB: '0' };
  }

  try {
    let totalSize = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length + key.length;
      }
    }

    // Typical localStorage limit is 5-10MB, we'll use 5MB as conservative estimate
    const limit = 5 * 1024 * 1024; // 5MB in bytes
    const percentage = (totalSize / limit) * 100;

    return {
      used: totalSize,
      available: limit - totalSize,
      percentage: Math.min(percentage, 100),
      usedMB: (totalSize / (1024 * 1024)).toFixed(2),
      availableMB: ((limit - totalSize) / (1024 * 1024)).toFixed(2)
    };
  } catch (error) {
    console.error('Error calculating storage:', error);
    return { used: 0, available: 0, percentage: 0, usedMB: '0', availableMB: '0' };
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};
