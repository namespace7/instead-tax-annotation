import { StandardFonts, rgb } from "pdf-lib";

/**
 * Render renderer-independent annotation instructions
 * onto a PDF document.
 *
 * The renderer is intentionally responsible only for
 * PDF concerns:
 *
 * - pages
 * - coordinates
 * - text
 * - fonts
 * - checkboxes
 *
 * It does not resolve data or evaluate business rules.
 */

export async function renderAnnotations(pdfDoc, instructions) {
  for (const instruction of instructions) {
    switch (instruction.type) {
      case "text":
      case "number":
      case "currency":
      case "date":
      case "percentage":
        renderText(pdfDoc, instruction);
        break;

      case "checkbox":
        renderCheckbox(pdfDoc, instruction);
        break;

      default:
        throw new Error(`Unsupported rendering type: ${instruction.type}`);
    }
  }
  return pdfDoc;
}

export function toPdfCoordinates(page, box) {
  const { height: pageHeight } = page.getSize();

  return {
    x: box.x,
    y: pageHeight - box.y - box.height,
  };
}

export function calculateTextPosition({
  box,
  boxX,
  boxY,
  textWidth,
  textHeight,
  alignment = "left",
  verticalAlignment = "bottom",
}) {
  let x = boxX;

  if (alignment === "center") {
    x = boxX + (box.width - textWidth) / 2;
  }

  if (alignment === "right") {
    x = boxX + box.width - textWidth;
  }

  let y = boxY;

  if (verticalAlignment === "middle") {
    y = boxY + (box.height - textHeight) / 2;
  }

  if (verticalAlignment === "top") {
    y = boxY + box.height - textHeight;
  }

  return { x, y };
}

export function fitTextToBox({
  text,
  font,
  box,
  fontSize,
  overflow = "clip",
  minFontSize = 6,
}) {
  let currentFontSize = fontSize;

  if (overflow !== "shrink") {
    return currentFontSize;
  }

  while (
    font.widthOfTextAtSize(text, currentFontSize) > box.width &&
    currentFontSize > minFontSize
  ) {
    currentFontSize -= 1;
  }

  return currentFontSize;
}

function renderText(pdfDoc, instruction) {
  const page = pdfDoc.getPage(instruction.target.page - 1);

  const box = instruction.target.box;

  const { x: boxX, y: boxY } = toPdfCoordinates(page, box);

  const font = pdfDoc.embedStandardFont(StandardFonts.Helvetica);

  const requestedFontSize = instruction.format?.fontSize ?? 10;
  const text = instruction.value;

  const fontSize = fitTextToBox({
    text,
    font,
    box,
    fontSize: requestedFontSize,
    overflow: instruction.behavior?.overflow ?? "clip",
    minFontSize: instruction.behavior?.minFontSize ?? 6,
  });

  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const textHeight = font.heightAtSize(fontSize);

  const { x, y } = calculateTextPosition({
    box,
    boxX,
    boxY,
    textWidth,
    textHeight,
    alignment: instruction.format?.alignment ?? "left",
    verticalAlignment: instruction.format?.verticalAlignment ?? "bottom",
  });

  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
  });
}

function renderCheckbox(pdfDoc, instruction) {
  const page = pdfDoc.getPage(instruction.target.page - 1);

  const box = instruction.target.box;

  const { x, y } = toPdfCoordinates(page, box);

  page.drawRectangle({
    x,
    y,
    width: box.width,
    height: box.height,
    color: rgb(1, 1, 1),
    borderColor: rgb(0, 0, 0),
    borderWidth: 1,
  });

  if (!instruction.checked) {
    return;
  }

  page.drawLine({
    start: {
      x: x + 3,
      y: y + box.height / 2,
    },
    end: {
      x: x + box.width / 2 - 1,
      y: y + 3,
    },
    thickness: 1.5,
  });

  page.drawLine({
    start: {
      x: x + box.width / 2 - 1,
      y: y + 3,
    },
    end: {
      x: x + box.width - 3,
      y: y + box.height - 3,
    },
    thickness: 1.5,
  });
}
