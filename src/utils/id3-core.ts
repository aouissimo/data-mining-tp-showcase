/**
 * ID3 (Iterative Dichotomiser 3) Core Algorithm
 * Specifically designed for categorical data.
 */

import type { DataRow } from './preprocessing';

export interface TreeNode {
  attribute?: string;
  value?: string | number;
  children: { [key: string]: TreeNode };
  isLeaf: boolean;
  label?: string;
}

/**
 * Calculate Entropy of a dataset
 * H(S) = -sum(p_i * log2(p_i))
 */
export const calculateEntropy = (data: DataRow[], targetAttr: string): number => {
  const total = data.length;
  if (total === 0) return 0;

  const counts: { [key: string]: number } = {};
  data.forEach((row) => {
    const label = row[targetAttr];
    counts[label] = (counts[label] || 0) + 1;
  });

  return Object.values(counts).reduce((acc, count) => {
    const p = count / total;
    return acc - p * Math.log2(p);
  }, 0);
};

/**
 * Calculate Information Gain for an attribute
 * Gain(S, A) = Entropy(S) - sum(|S_v|/|S| * Entropy(S_v))
 */
export const calculateInfoGain = (data: DataRow[], attr: string, targetAttr: string): number => {
  const totalEntropy = calculateEntropy(data, targetAttr);
  const total = data.length;
  
  const attrValues = Array.from(new Set(data.map(row => row[attr])));
  let weightedEntropy = 0;

  attrValues.forEach((val) => {
    const subset = data.filter(row => row[attr] === val);
    const subsetEntropy = calculateEntropy(subset, targetAttr);
    weightedEntropy += (subset.length / total) * subsetEntropy;
  });

  return totalEntropy - weightedEntropy;
};

/**
 * Recursive ID3 algorithm
 */
export const buildID3Tree = (
  data: DataRow[],
  targetAttr: string,
  remainingAttrs: string[]
): TreeNode => {
  // If all instances have the same label, return leaf
  const labels = Array.from(new Set(data.map(row => row[targetAttr])));
  if (labels.length === 1) {
    return { isLeaf: true, label: String(labels[0]), children: {} };
  }

  // If no remaining attributes, return leaf with majority label
  if (remainingAttrs.length === 0) {
    const counts: { [key: string]: number } = {};
    data.forEach(row => {
      const label = row[targetAttr];
      counts[label] = (counts[label] || 0) + 1;
    });
    const majorityLabel = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
    return { isLeaf: true, label: String(majorityLabel), children: {} };
  }

  // Find attribute with maximum Information Gain
  let bestAttr = remainingAttrs[0];
  let maxGain = -1;

  remainingAttrs.forEach((attr) => {
    const gain = calculateInfoGain(data, attr, targetAttr);
    if (gain > maxGain) {
      maxGain = gain;
      bestAttr = attr;
    }
  });

  const root: TreeNode = {
    attribute: bestAttr,
    children: {},
    isLeaf: false,
  };

  const attrValues = Array.from(new Set(data.map(row => row[bestAttr])));
  const nextRemainingAttrs = remainingAttrs.filter(a => a !== bestAttr);

  attrValues.forEach((val) => {
    const subset = data.filter(row => row[bestAttr] === val);
    if (subset.length === 0) {
      // Should not happen with current splits, but for safety:
      const counts: { [key: string]: number } = {};
      data.forEach(row => {
        const label = row[targetAttr];
        counts[label] = (counts[label] || 0) + 1;
      });
      const majorityLabel = Object.keys(counts).reduce((a, b) => (counts[a] > counts[b] ? a : b));
      root.children[String(val)] = { isLeaf: true, label: String(majorityLabel), children: {} };
    } else {
      root.children[String(val)] = buildID3Tree(subset, targetAttr, nextRemainingAttrs);
    }
  });

  return root;
};

/**
 * Predict label for a given row
 */
export const predict = (tree: TreeNode, row: DataRow): string => {
  if (tree.isLeaf) return tree.label!;
  
  const attrVal = String(row[tree.attribute!]);
  const child = tree.children[attrVal];
  
  if (!child) {
    // If no path exists, return "unknown" or most common (simplified)
    return "N/A";
  }
  
  return predict(child, row);
};
