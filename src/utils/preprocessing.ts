/**
 * Preprocessing utilities for Data Mining
 * Based on the provided lecture notes.
 */

export interface DataRow {
  [key: string]: any;
}

/**
 * Data Cleaning: Handle missing values
 */
export const handleMissingValues = (
  data: DataRow[],
  strategy: 'mean' | 'mode' | 'constant' | 'remove',
  constantValue?: any
): DataRow[] => {
  if (strategy === 'remove') {
    return data.filter((row) => Object.values(row).every((val) => val !== null && val !== undefined && val !== ''));
  }

  const columns = Object.keys(data[0]);
  const result = [...data];

  columns.forEach((col) => {
    const values = data.map((row) => row[col]).filter((val) => val !== null && val !== undefined && val !== '');

    let replacement: any;
    if (typeof data[0][col] === 'number') {
      if (strategy === 'mean') {
        replacement = values.reduce((a, b) => a + b, 0) / values.length;
      } else if (strategy === 'constant') {
        replacement = constantValue ?? 0;
      } else {
        // mode for numbers
        const counts: any = {};
        values.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
        replacement = Number(Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b)));
      }
    } else {
      // Nominal values
      if (strategy === 'constant') {
        replacement = constantValue ?? 'unknown';
      } else {
        // mode
        const counts: any = {};
        values.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
        replacement = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
      }
    }

    result.forEach((row) => {
      if (row[col] === null || row[col] === undefined || row[col] === '') {
        row[col] = replacement;
      }
    });
  });

  return result;
};

/**
 * Data Transformation: Min-Max Normalization
 */
export const minMaxNormalize = (data: DataRow[], columns: string[]): DataRow[] => {
  const result = data.map((row) => ({ ...row }));
  columns.forEach((col) => {
    const values = data.map((row) => row[col] as number);
    const min = Math.min(...values);
    const max = Math.max(...values);
    if (max === min) return;

    result.forEach((row) => {
      row[col] = (row[col] - min) / (max - min);
    });
  });
  return result;
};

/**
 * Data Transformation: Z-Score Normalization
 */
export const zScoreNormalize = (data: DataRow[], columns: string[]): DataRow[] => {
  const result = data.map((row) => ({ ...row }));
  columns.forEach((col) => {
    const values = data.map((row) => row[col] as number);
    const n = values.length;
    const mean = values.reduce((a, b) => a + b, 0) / n;
    const stdDev = Math.sqrt(values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n);
    if (stdDev === 0) return;

    result.forEach((row) => {
      row[col] = (row[col] - mean) / stdDev;
    });
  });
  return result;
};

/**
 * Data Transformation: Discretization (Equal-width Binning)
 */
export const discretizeEqualWidth = (data: DataRow[], col: string, numBins: number): DataRow[] => {
  const values = data.map((row) => row[col] as number);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / numBins;

  return data.map((row) => {
    const val = row[col] as number;
    let binIndex = Math.floor((val - min) / width);
    if (binIndex >= numBins) binIndex = numBins - 1;
    const binRange = `[${(min + binIndex * width).toFixed(2)}, ${(min + (binIndex + 1) * width).toFixed(2)}${binIndex === numBins - 1 ? ']' : ')'}`;
    return { ...row, [col]: binRange };
  });
};

/**
 * Sampling: Train/Test split
 */
export const splitData = (data: DataRow[], trainRatio: number = 0.8) => {
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  const splitIndex = Math.floor(shuffled.length * trainRatio);
  return {
    train: shuffled.slice(0, splitIndex),
    test: shuffled.slice(splitIndex),
  };
};
