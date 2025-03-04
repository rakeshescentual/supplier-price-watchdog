
import { PriceItem } from '@/types/price';

/**
 * Generates HTML for price increase notices to be displayed on Escentual.com product pages
 */
export const generatePriceIncreaseSnippet = (
  item: PriceItem,
  effectiveDate: Date
): string => {
  if (item.status !== 'increased') {
    return '';
  }
  
  const formattedDate = effectiveDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long', 
    year: 'numeric'
  });
  
  return `
<!-- Escentual.com Price Increase Notice -->
<div class="escentual-price-increase-notice" style="margin: 1rem 0; padding: 0.75rem; border-radius: 0.375rem; background-color: #fffbeb; border: 1px solid #fef3c7; font-size: 0.875rem; color: #92400e;">
  <p style="font-weight: 500; margin-bottom: 0.25rem; color: #92400e;">
    Price increase coming soon
  </p>
  <p style="margin: 0; color: #b45309;">
    From <span style="font-weight: 500;">${formattedDate}</span>, 
    the price of this product will increase from 
    <span style="font-weight: 500;">£${item.oldPrice.toFixed(2)}</span> to
    <span style="font-weight: 500;">£${item.newPrice.toFixed(2)}</span>.
  </p>
</div>
<!-- End Price Increase Notice -->
  `;
};

/**
 * Exports HTML snippets for all products with price increases
 */
export const exportPriceIncreaseSnippets = (
  items: PriceItem[],
  effectiveDate: Date
): string => {
  const increasedItems = items.filter(item => item.status === 'increased');
  
  if (increasedItems.length === 0) {
    return '';
  }
  
  let output = `# Escentual.com Price Increase Notices\n`;
  output += `# Generated on ${new Date().toLocaleString()}\n`;
  output += `# Effective Date: ${effectiveDate.toLocaleDateString()}\n\n`;
  
  increasedItems.forEach(item => {
    output += `## Product: ${item.name} (SKU: ${item.sku})\n`;
    output += `### Price Change: £${item.oldPrice.toFixed(2)} → £${item.newPrice.toFixed(2)} (${item.difference.toFixed(2)}%)\n\n`;
    output += "```html\n";
    output += generatePriceIncreaseSnippet(item, effectiveDate);
    output += "\n```\n\n";
  });
  
  return output;
};

/**
 * Creates a downloadable HTML file with price increase snippets
 */
export const downloadPriceIncreaseSnippets = (
  items: PriceItem[],
  effectiveDate: Date
): void => {
  const snippetsContent = exportPriceIncreaseSnippets(items, effectiveDate);
  
  if (!snippetsContent) {
    console.error('No snippets to download');
    return;
  }
  
  const blob = new Blob([snippetsContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `escentual-price-increase-snippets-${effectiveDate.toISOString().slice(0, 10)}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
