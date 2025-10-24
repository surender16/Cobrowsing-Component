import { popularTravelData, adventureData, luxuryData, featuredPackage } from '../constants/packagesData';
import { samplePackageData } from '../data/samplePackageData';

/**
 * Utility for looking up packages by ID from the static packages data
 * This is used to reconstruct package objects when receiving only IDs via OpenTok signals
 */

// Combine all package data sources into a single array
// Include richer world packages used in calls/cobrowse flows
const allPackages = [
    featuredPackage,
    ...popularTravelData,
    ...adventureData,
    ...luxuryData,
    ...(Array.isArray(samplePackageData) ? samplePackageData : [])
];

// Create a Map for O(1) lookup performance
const packageMap = new Map();

// Initialize the package map
allPackages.forEach(pkg => {
    // Create a composite key with category prefix to handle potential ID collisions
    const key = pkg.id.toString();
    packageMap.set(key, pkg);
});

/**
 * Get a package by its ID
 * @param {number|string} packageId - The package ID to look up
 * @returns {Object|null} - The package object or null if not found
 */
export const getPackageById = (packageId) => {
    if (packageId === null || packageId === undefined) {
        console.warn('getPackageById called with null/undefined ID');
        return null;
    }
    
    const key = packageId.toString();
    const pkg = packageMap.get(key);
    
    if (!pkg) {
        console.warn(`Package not found for ID: ${packageId}`);
        return null;
    }
    
    return pkg;
};

/**
 * Get multiple packages by their IDs
 * @param {Array<number|string>} packageIds - Array of package IDs
 * @returns {Array<Object>} - Array of package objects (excludes not found packages)
 */
export const getPackagesByIds = (packageIds) => {
    if (!Array.isArray(packageIds)) {
        console.warn('getPackagesByIds called with non-array:', packageIds);
        return [];
    }
    
    return packageIds
        .map(id => getPackageById(id))
        .filter(pkg => pkg !== null);
};

/**
 * Extract only the IDs from an array of package objects
 * @param {Array<Object>} packages - Array of package objects
 * @returns {Array<number|string>} - Array of package IDs
 */
export const extractPackageIds = (packages) => {
    if (!Array.isArray(packages)) {
        console.warn('extractPackageIds called with non-array:', packages);
        return [];
    }
    
    return packages.map(pkg => pkg.id).filter(id => id !== null && id !== undefined);
};

/**
 * Check if a package ID exists in the data
 * @param {number|string} packageId - The package ID to check
 * @returns {boolean} - True if the package exists
 */
export const packageExists = (packageId) => {
    if (packageId === null || packageId === undefined) {
        return false;
    }
    return packageMap.has(packageId.toString());
};

/**
 * Get all available package IDs
 * @returns {Array<string>} - Array of all package IDs
 */
export const getAllPackageIds = () => {
    return Array.from(packageMap.keys());
};

/**
 * Get statistics about the package data
 * @returns {Object} - Statistics object
 */
export const getPackageStats = () => {
    return {
        total: packageMap.size,
        featured: 1,
        popular: popularTravelData.length,
        adventure: adventureData.length,
        luxury: luxuryData.length,
        world: Array.isArray(samplePackageData) ? samplePackageData.length : 0
    };
};

// Log statistics on initialization
console.log('📦 Package Lookup Utility initialized:', getPackageStats());

export default {
    getPackageById,
    getPackagesByIds,
    extractPackageIds,
    packageExists,
    getAllPackageIds,
    getPackageStats
};

