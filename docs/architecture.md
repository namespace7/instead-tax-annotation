# Architecture

## Overview

The system is divided into independent stages.

        Tax Data
        |
        v
        Annotation Specification
        |
        v
        Schema Validation
        |
        v
        Source Resolution
        |
        v
        Condition Evaluation
        |
        v
        Value Formatting
        |
        v
        Rendering Instructions
        |
        v
        PDF Renderer
        |
        v
        Filled PDF

## Components

**Validator**

`src/validator.js`

Validates the annotation specification against the JSON Schema.

Its responsibility is structural validation.

It does not determine whether a source path exists in the input data.

---

**Resolver**

`src/resolver.js`

Resolves values from the input data using the supported JSONPath-like syntax.

Example:

    $.taxpayer.name.first

---

**Condition Evaluator**

`src/condition.js`

Evaluates annotation conditions.

Supported operators:

    equals
    notEquals

The result determines whether an annotation should produce a rendering instructions.

---

**Formatter**

`src/formatter.js`

Converts resolved values into display strings.

Examples:

    95000
        -> $95,000.00

    0.24
        -> 24.0%

    2025-04-15
        -> 4/15/2025

---

**Engine**

`The engine brings all the parts together and makes them work as one.`

### It:
1. validates the specification
2. resolves source values
3. handles missing values
4. evaluates conditions
5. format values
6. produces renderer-independent instructions

The engine intentionally does not know about PDF APIs.

---

**Renderer**

`src/renderer.js`

Consumes renderer-independent instructions and applies them to a PDF.

### The renderer is responsible for:
- PDF pages
- coordinates conversion
- text placement
- alignment
- font handling
- checkboxes
- overflow handling

This separation allows the same annotation specification to potentially be rendered using a different PDF library or output format.

---

**Coordinate System**

The specification uses a top-left coordinate system in the demo.

This is a deliberate abstraction.

PDF libraries commonly use a bottom-left origin, so the renderer performs the conversion.

For a page of height `H`:

    PDF Y = H - annotationY- annotationHeight

For example:

    page height = 800
    annotation y = 100
    annotation height = 20

    PDF y = 800 - 100 - 20
          = 680

This keeps the annotation format straightforward while isolating PDF-specific coordinate behavior inside the renderer.

---

**Why separate the engine and the renderer?**

The importance boundary is:

    Business/Data concerns
        |
        v
      Engine
        |
        v
    Rendering instructions
        |
        v
      Renderer
        |
        v
      PDF

The engine understands:
- data
- paths
- conditions
- formatting
- missing values

The renderer understands:
- pages
- coordinates
- fonts
- drawing operations

This prevents PDF-specific code from becoming responsible for business logic.

---

## Demo

The demo consists of:

    scripts/create-demo-form.js

which create a blank PDF form, and:

    scripts/fill-demo-form.js

### which:
1. loads the sample tax data
2. loads the annotation specification
3. processes the annotations
4. renders the resulting instructions
5. writes the filled PDF

Run:

    npm run demo:form
    npm run demo:fill

Output:

    examples/output/demo-form.pdf
    examples/output/filled-demo-form.pdf

---

# Testing

The project uses Vitest.

Run:

    npm run test:run

### The test suite covers:
- source resolution
- conditions
- formatting
- schema validation
- engine behavior
- missing values
- overflow
- PDF rendering
- coordinate conversion
- text alignment
- checkbox rendering

---


