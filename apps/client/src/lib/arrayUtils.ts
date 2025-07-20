/**
 * Array validation utilities for robust data handling
 * Prevents "array.map is not a function" errors throughout the application
 */

/**
 * Ensures the input is always an array, regardless of API response format
 * @param data - Any data that should be an array
 * @returns Always returns an array, empty if input is invalid
 */
export const ensureArray = <T = any>(data: any): T[] => {
  // If it's already an array, return it
  if (Array.isArray(data)) {
    return data;
  }
  
  // Handle paginated API responses with articles property
  if (data?.articles && Array.isArray(data.articles)) {
    return data.articles;
  }
  
  // Handle nested data property
  if (data?.data && Array.isArray(data.data)) {
    return data.data;
  }
  
  // Handle cases where data.data.data exists (nested API responses)
  if (data?.data?.data && Array.isArray(data.data.data)) {
    return data.data.data;
  }
  
  // If data is null, undefined, or any non-array type, return empty array
  return [];
};

/**
 * Safely performs array operations with validation
 * @param data - Input data to validate
 * @param operation - Function to execute on the validated array
 * @param fallback - Fallback value if operation fails
 */
export const safeArrayOperation = <T, R>(
  data: any,
  operation: (arr: T[]) => R,
  fallback: R
): R => {
  try {
    const validArray = ensureArray<T>(data);
    return operation(validArray);
  } catch (error) {
    console.warn('Array operation failed, using fallback:', error);
    return fallback;
  }
};

/**
 * Safely calculates array statistics
 * @param data - Array data
 * @param field - Field to sum (optional)
 * @returns Object with count, sum, and average
 */
export const safeArrayStats = (data: any, field?: string) => {
  const validArray = ensureArray(data);
  
  if (validArray.length === 0) {
    return { count: 0, sum: 0, average: 0 };
  }
  
  const count = validArray.length;
  
  if (!field) {
    return { count, sum: count, average: 1 };
  }
  
  const sum = validArray.reduce((acc, item) => {
    const value = item?.[field] || 0;
    return acc + (typeof value === 'number' ? value : 0);
  }, 0);
  
  const average = count > 0 ? sum / count : 0;
  
  return { count, sum, average };
};

/**
 * Safely filters an array with validation
 * @param data - Input data
 * @param predicate - Filter function
 * @returns Filtered array
 */
export const safeFilter = <T>(
  data: any,
  predicate: (item: T) => boolean
): T[] => {
  return safeArrayOperation(data, arr => arr.filter(predicate), []);
};

/**
 * Safely maps an array with validation
 * @param data - Input data
 * @param mapper - Map function
 * @returns Mapped array
 */
export const safeMap = <T, R>(
  data: any,
  mapper: (item: T, index: number) => R
): R[] => {
  return safeArrayOperation(data, arr => arr.map(mapper), []);
};

/**
 * Safely reduces an array with validation
 * @param data - Input data
 * @param reducer - Reduce function
 * @param initialValue - Initial value for reduction
 * @returns Reduced value
 */
export const safeReduce = <T, R>(
  data: any,
  reducer: (acc: R, item: T, index: number) => R,
  initialValue: R
): R => {
  return safeArrayOperation(data, arr => arr.reduce(reducer, initialValue), initialValue);
};

/**
 * Safely finds an item in an array
 * @param data - Input data
 * @param predicate - Find function
 * @returns Found item or undefined
 */
export const safeFind = <T>(
  data: any,
  predicate: (item: T) => boolean
): T | undefined => {
  return safeArrayOperation(data, arr => arr.find(predicate), undefined);
};

/**
 * Creates a safe array from API response data specifically for articles
 * @param response - API response object
 * @returns Safe array of articles
 */
export const extractArticlesArray = (response: any) => {
  // Handle Axios response wrapper
  const data = response?.data || response;
  
  // Extract articles from various possible response formats
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data?.articles && Array.isArray(data.articles)) {
    return data.articles;
  }
  
  if (data?.data && Array.isArray(data.data)) {
    return data.data;
  }
  
  if (data?.data?.articles && Array.isArray(data.data.articles)) {
    return data.data.articles;
  }
  
  console.warn('Could not extract articles array from response:', data);
  return [];
};

/**
 * Creates a safe array from API response data specifically for categories
 * @param response - API response object
 * @returns Safe array of categories
 */
export const extractCategoriesArray = (response: any) => {
  // Handle Axios response wrapper
  const data = response?.data || response;
  
  // Extract categories from various possible response formats
  if (Array.isArray(data)) {
    return data;
  }
  
  if (data?.categories && Array.isArray(data.categories)) {
    return data.categories;
  }
  
  if (data?.data && Array.isArray(data.data)) {
    return data.data;
  }
  
  if (data?.data?.categories && Array.isArray(data.data.categories)) {
    return data.data.categories;
  }
  
  console.warn('Could not extract categories array from response:', data);
  return [];
};

/**
 * Validates and normalizes pagination metadata
 * @param response - API response object
 * @returns Normalized pagination info
 */
export const extractPaginationInfo = (response: any) => {
  const data = response?.data || response;
  
  return {
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    hasNextPage: data?.page ? data.page * data.limit < data.total : false,
    hasPrevPage: data?.page ? data.page > 1 : false
  };
};