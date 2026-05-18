
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateVisualPDF = async (elementId: string, fileName: string) => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Element with id ${elementId} not found`);
    }

    // Temporary style adjustments for capture
    const originalStyle = element.style.cssText;
    element.style.width = '210mm'; // Force A4 width
    element.style.minHeight = '297mm'; // Force A4 height
    element.style.transform = 'scale(1)'; // Reset scale
    element.style.margin = '0';

    // Wait for any potential re-renders or image loading
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const canvas = await html2canvas(element, {
            scale: 2, // Higher quality
            useCORS: true, // Allow images
            logging: false,
            windowWidth: 794, // A4 width in px at 96dpi (approx)
            windowHeight: 1123,
            onclone: (clonedDoc) => {
                // Ensure the cloned element is visible
                const clonedElement = clonedDoc.getElementById(elementId);
                if (clonedElement) {
                    clonedElement.style.display = 'block';
                }
            }
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(fileName);
    } finally {
        // Restore style
        element.style.cssText = originalStyle;
    }
};
