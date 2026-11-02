/**
 * Utility functions placeholder
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
};
