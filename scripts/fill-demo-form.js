import fs from "node:fs/promises";

import { PDFDocument } from "pdf-lib";

import taxData from "../examples/tax-data.json" with { type: "json" };

import specification from "../examples/demo-annotations.json" with { type: "json" };

import { processAnnotations } from "../src/engine.js";
import { renderAnnotations } from "../src/renderer.js";

const inputBytes = await fs.readFile("examples/output/demo-form.pdf");

const pdfDoc = await PDFDocument.load(inputBytes);

const instructions = processAnnotations(taxData, specification);

await renderAnnotations(pdfDoc, instructions);

const outputBytes = await pdfDoc.save();

await fs.writeFile("examples/output/filled-demo-form.pdf", outputBytes);

console.log("Created examples/output/filled-demo-form.pdf");
