export type SortOrder = "asc" | "desc" | undefined;

/**
 * Sorts an array of objects by a given key.
 * @param data The array to sort.
 * @param key The key of the object to sort by.
 * @param sortOrder The sort order: 'asc' | 'desc' | undefined.
 * @returns The sorted array.
 */
export function sortByKey<T extends Record<string, any>>(
  data: T[],
  key: keyof T,
  sortOrder: SortOrder
): T[] {
  if (!key || !sortOrder) return data;

  return data.sort((a, b) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === undefined || bValue === undefined) return 0;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
}
