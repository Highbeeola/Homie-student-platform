// lib/utils.ts

// This function can now be imported and used anywhere in your application
export function formatPrice(n: number | null | undefined): string {
  if (n === null || n === undefined) {
    return "Price on request";
  }
  return '₦' + n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '/yr';
}