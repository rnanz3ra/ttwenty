
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { CharacterSheet } from '@/core/types';

export const generatePDF = async (sheet: CharacterSheet) => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const { width, height } = page.getSize();
    const fontSize = 10;

    const drawText = (text: string, x: number, y: number, options: any = {}) => {
        page.drawText(text, {
            x,
            y,
            size: fontSize,
            font: options.font || font,
            color: options.color || rgb(0, 0, 0),
            ...options
        });
    };

    const drawBox = (x: number, y: number, w: number, h: number, label?: string) => {
        page.drawRectangle({
            x,
            y,
            width: w,
            height: h,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
        });
        if (label) {
            drawText(label, x, y + h + 2, { size: 6, font: fontBold, color: rgb(0.5, 0.5, 0.5) });
        }
    };

    const setText = (label: string, value: string) => {
        // Mock positioning login
    };

    // --- TITLE ---
    drawText('Tormenta20 - Ficha de Personagem', 50, height - 50, { size: 18, font: fontBold });

    // --- BASIC INFO ---
    let y = height - 100;
    drawText(`Nome: ${sheet.name || ''}`, 50, y, { font: fontBold });
    drawText(`Jogador: ${sheet.playerName || ''}`, 300, y, { font: fontBold });
    y -= 20;
    drawText(`Raça: ${sheet.race?.name || ''}`, 50, y);
    drawText(`Classe: ${sheet.class?.name || ''}`, 200, y);
    drawText(`Nível: ${sheet.level}`, 400, y);
    y -= 20;
    drawText(`Origem: ${sheet.origin?.nome || ''}`, 50, y);
    drawText(`Divindade: ${sheet.divinity?.nome || ''}`, 200, y);

    // --- ATTRIBUTES ---
    y -= 40;
    drawText('ATRIBUTOS', 50, y, { font: fontBold });
    y -= 20;
    const attrs = sheet.attributes;
    let x = 50;
    Object.entries(attrs).forEach(([key, val]) => {
        // Add race bonuses
        let total = val;
        if (sheet.race?.bonus && (sheet.race.bonus as any)[key]) {
            total += (sheet.race.bonus as any)[key];
        }

        drawBox(x, y - 30, 40, 40, key.toUpperCase());
        drawText(`${total}`, x + 12, y - 10, { size: 14, font: fontBold });
        x += 50;
    });

    // --- DETAILS ---
    y -= 60;
    drawText('HABILIDADES & PODERES', 50, y, { font: fontBold });
    y -= 20;

    const abilities = [
        ...(sheet.race?.abilities.map(a => `[Raça] ${a.name}: ${a.description}`) || []),
        ...(sheet.class?.abilities.map(a => `[Classe] ${a.name}: ${a.description}`) || []),
        sheet.origin ? `[Origem] ${sheet.origin.nome}: ${sheet.origin.beneficios ? Object.values(sheet.origin.beneficios).join('; ') : ''}` : '',
        sheet.divinity ? `[Divindade] ${sheet.divinity.nome}: ${sheet.divinity.poderes_concedidos?.map(p => p.nome).join(', ')}` : ''
    ].filter(Boolean);

    let textY = y;
    abilities.forEach(ability => {
        // Simple text wrapping mock
        if (textY < 50) return; // limit
        drawText(ability, 50, textY, { size: 8 });
        textY -= 15;
    });


    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}
