/**
 * Utility to generate PDFs using html2pdf.js in a Next.js environment.
 */
export const generatePDF = async (elementId: string, filename: string) => {
  // Dynamic import to avoid SSR errors
  const html2pdf = (await import("html2pdf.js" as any)).default;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }

  const opt = {
    margin: [10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 3, // Increased scale for better quality
      useCORS: true,
      letterRendering: true,
      backgroundColor: '#ffffff',
      logging: false // Reduced logging
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] } // Better page break handling
  };

  try {
    // We use a promise to ensure the download is triggered
    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
