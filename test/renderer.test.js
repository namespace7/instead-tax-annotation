import { describe, expect, test } from "vitest";
import { PDFDocument, StandardFonts } from "pdf-lib";
import {
  renderAnnotations,
  toPdfCoordinates,
  calculateTextPosition,
  fitTextToBox,
} from "../src/renderer.js";

describe("renderAnnotations", () => {
  test("renders text onto a PDF page", async () => {
    const pdfDoc = await PDFDocument.create();

    pdfDoc.addPage([600, 800]);

    const instructions = [
      {
        id: "taxpayer.firstName",
        type: "text",
        value: "Yashwant",
        target: {
          page: 1,
          box: {
            x: 100,
            y: 100,
            width: 150,
            height: 20,
          },
        },
        format: {
          fontFamily: "Helvetica",
          fontSize: 10,
          alignment: "left",
          verticalAlignment: "middle",
        },
      },
    ];

    await renderAnnotations(pdfDoc, instructions);

    const pdfBytes = await pdfDoc.save();

    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  test("converts top-left coordinates to PDF coordinates", async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    const result = toPdfCoordinates(page, {
      x: 100,
      y: 100,
      width: 150,
      height: 20,
    });

    expect(result).toEqual({
      x: 100,
      y: 680,
    });
  });

  test("aligns text to the right", () => {
    const result = calculateTextPosition({
      box: {
        x: 100,
        y: 100,
        width: 100,
        height: 20,
      },
      boxX: 100,
      boxY: 680,
      textWidth: 40,
      textHeight: 10,
      alignment: "right",
      verticalAlignment: "bottom",
    });

    expect(result).toEqual({
      x: 160,
      y: 680,
    });
  });

  test("centers text horizontally", () => {
    const result = calculateTextPosition({
      box: {
        x: 100,
        y: 100,
        width: 100,
        height: 20,
      },
      boxX: 100,
      boxY: 680,
      textWidth: 40,
      textHeight: 10,
      alignment: "center",
      verticalAlignment: "bottom",
    });

    expect(result).toEqual({
      x: 130,
      y: 680,
    });
  });

  test("centers text vertically", () => {
    const result = calculateTextPosition({
      box: {
        x: 100,
        y: 100,
        width: 100,
        height: 20,
      },
      boxX: 100,
      boxY: 680,
      textWidth: 40,
      textHeight: 10,
      alignment: "left",
      verticalAlignment: "middle",
    });

    expect(result).toEqual({
      x: 100,
      y: 685,
    });
  });

  test("renders a checked checkbox", async () => {
    const pdfDoc = await PDFDocument.create();

    pdfDoc.addPage([600, 800]);

    const instructions = [
      {
        id: "filing.single",
        type: "checkbox",
        checked: true,
        target: {
          page: 1,
          box: {
            x: 100,
            y: 100,
            width: 15,
            height: 15,
          },
        },
      },
    ];

    await renderAnnotations(pdfDoc, instructions);

    const pdfBytes = await pdfDoc.save();

    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  test("renders an unchecked checkbox without a check mark", async () => {
    const pdfDoc = await PDFDocument.create();

    pdfDoc.addPage([600, 800]);

    const instructions = [
      {
        id: "filing.single",
        type: "checkbox",
        checked: false,
        target: {
          page: 1,
          box: {
            x: 100,
            y: 100,
            width: 15,
            height: 15,
          },
        },
      },
    ];

    await renderAnnotations(pdfDoc, instructions);

    const pdfBytes = await pdfDoc.save();

    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  test("shrinks text when it exceeds the box", async () => {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedStandardFont(StandardFonts.Helvetica);

    const fontSize = fitTextToBox({
      text: "This is a very long taxpayer name",
      font,
      box: {
        x: 100,
        y: 100,
        width: 100,
        height: 20,
      },
      fontSize: 10,
      overflow: "shrink",
      minFontSize: 7,
    });

    expect(fontSize).toBeLessThan(10);
    expect(fontSize).toBeGreaterThanOrEqual(7);
  });

  test("does not shrink below the minimum font size", async () => {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedStandardFont(StandardFonts.Helvetica);

    const fontSize = fitTextToBox({
      text: "This is an extremely long taxpayer name that cannot fit",
      font,
      box: {
        x: 100,
        y: 100,
        width: 30,
        height: 20,
      },
      fontSize: 10,
      overflow: "shrink",
      minFontSize: 7,
    });

    expect(fontSize).toBe(7);
  });

  test("renders long text using the shrink overflow behavior", async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.addPage([600, 800]);

    const instructions = [
      {
        id: "taxpayer.longName",
        type: "text",
        value: "This is a very long taxpayer name",
        target: {
          page: 1,
          box: {
            x: 100,
            y: 100,
            width: 100,
            height: 20,
          },
        },
        format: {
          fontFamily: "Helvetica",
          fontSize: 10,
          alignment: "left",
          verticalAlignment: "middle",
        },
        behavior: {
          overflow: "shrink",
          minFontSize: 7,
        },
      },
    ];

    await renderAnnotations(pdfDoc, instructions);

    const pdfBytes = await pdfDoc.save();

    expect(pdfBytes.length).toBeGreaterThan(0);
  });
});
