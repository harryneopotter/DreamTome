import html2canvas from 'html2canvas';

/**
 * Slugify a string for use in filenames
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50); // Limit length
}

/**
 * Export a dream card as PNG image
 */
export async function exportDreamAsPNG(dreamTitle: string): Promise<void> {
  const element = document.getElementById('dream-export-card');
  
  if (!element) {
    throw new Error('Export card element not found');
  }

  try {
    // Use html2canvas to render the card
    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 2,
      logging: false,
      useCORS: true,
    });

    // Convert to blob and download - wrapped in Promise
    await new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Failed to create image blob'));
          return;
        }

        try {
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `dreamtome-${slugify(dreamTitle)}.png`;

          // Trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Cleanup
          URL.revokeObjectURL(url);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 'image/png');
    });
  } catch (error) {
    console.error('Error exporting dream:', error);
    throw error;
  }
}
