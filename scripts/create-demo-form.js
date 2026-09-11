import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "node:fs/promises";

const pdfDoc = await PDFDocument.create();

const page = pdfDoc.addPage([600, 800]);

const font = await pdfDoc.embedStandardFont(StandardFonts.Helvetica);

page.drawText("U.S. TAX FORM - DEMO", {
  x: 180,
  y: 750,
  size: 18,
  font,
});

// FirstName
page.drawText("First Name:", {
  x: 50,
  y: 680,
  size: 10,
  font,
});

page.drawRectangle({
  x: 120,
  y: 675,
  width: 150,
  height: 20,
  color: rgb(1, 1, 1),
  borderColor: rgb(0, 0, 0),
  borderWidth: 1,
});

// ZipCode
page.drawText("ZIP Code:", {
  x: 50,
  y: 620,
  size: 10,
  font,
});

page.drawRectangle({
  x: 120,
  y: 615,
  width: 70,
  height: 20,
  color: rgb(1, 1, 1),
  borderColor: rgb(0, 0, 0),
  borderWidth: 1,
});

// Wages
page.drawText("Wages:", {
  x: 50,
  y: 560,
  size: 10,
  font,
});

page.drawRectangle({
  x: 120,
  y: 555,
  width: 100,
  height: 20,
  color: rgb(1, 1, 1),
  borderColor: rgb(0, 0, 0),
  borderWidth: 1,
});

//FilingDate 
page.drawText("Filing Date:", {
  x: 50,
  y: 500,
  size: 10,
  font,
});

page.drawRectangle({
  x: 120,
  y: 495,
  width: 100,
  height: 20,
  color: rgb(1, 1, 1),
  borderColor: rgb(0, 0, 0),
  borderWidth: 1,
});

// TaxRate
page.drawText("Tax Rate:", {
  x: 50,
  y: 440,
  size: 10,
  font,
});

page.drawRectangle({
  x: 120,
  y: 435,
  width: 100,
  height: 20,
  color: rgb(1, 1, 1),
  borderColor: rgb(0, 0, 0),
  borderWidth: 1,
});

// Filing Status

page.drawText("Filing Status:", {
  x: 50,
  y: 525,
  size: 10,
  font,
});

page.drawRectangle({
  x: 120,
  y: 520,
  width: 15,
  height: 15,
  color: rgb(1, 1, 1),
  borderColor: rgb(0, 0, 0),
  borderWidth: 1,
});

page.drawText("Single", {
  x: 145,
  y: 523,
  size: 10,
  font,
});


await fs.mkdir("examples/output", {
  recursive: true,
});

const bytes = await pdfDoc.save();

await fs.writeFile("examples/output/demo-form.pdf", bytes);

console.log("Created examples/output/demo-form.pdf");
