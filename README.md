# Instead Tax form Annotation

A declarative annotation specification and reference implementation for mapping structured tax data onto fixed PDF form fields.

## Problem

tax form contains fixed boxes where values must be positioned precisely.

The goal of this project is to define a renderer-indepentent specifiction that answers:

- what values should be rendered?
- where should it be rendered?
- how should it be formatted?
- when should it be rendered?
- what should happen when data is missing or does not fit?

## Architecture

       Tax Data
       |
       v
       Annotation Specification
       |
       v
       Validation
       |
       v
       Resolution
       |
       v
       Conditions
       |
       v
       Formatting
       |
       v
       Rendering Instructions
       |
       v
       PDF Renderer
       |
       v
       Filled PDF

**Example**

        {
              "id": "income.wages",
              "type": "currency",
              "source": {
              "path": "$.income.wages"
              },
              "target": {
              "page": 1,
              "box": {
              "x": 120,
              "y": 225,
              "width": 100,
              "height": 20
              }
              },
              "format": {
              "fontFamily": "Helvetica",
              "fontSize": 10,
              "alignment": "right",
              "currency": "USD",
              "decimals": 2
              }
        }

Input:

       95000

Rendered value:

       $95,000.00

**Supported field types**

- text
- number
- currency
- date
- percentage
- checkbox

**Supported behavior**
- conditional rendering
- missing value handling
- text overflow handling
- minimum font size
- horizontal and vertical alignment
- nested data access
- array element access

## Running

install dependencies:

       npm install

Run tests:

       npm run test:run

Generate the demo form:

       npm run demo:form

Fill the demo form:

       npm run demo:fill

The generated PDFs are available under:

       examples/output/

## Documentation

- [Annotation Specification] (docs/annotation-spec.md)
- [Architecture](doc/architecture.md)


## Design Decisions

**Renderer independence**

The annotation format does not depend on a particular PDF library. The engine produces rendering instructions which can be comsumed by different renderers.

**Top-left coordinates**

The annotation specification uses a top-left coordinate system in the demo because it is easy to understand and makes it clear where fields are placed on a form. PDF-specific coordinate conversion is isolated inside the renderer.

## Small JSONPath-like syntax

Rather than implementing the entire JSONPath specification, the reference implementation supports the predictable subset required by the use case:

       $.taxpayer.name.first
       $.taxpayer.dependents[0].name.first


## Extensibility

The specification is designed so that future version can add capabilities without changing the code mapping model.

## Future Enhancements

Potential extensions include:

- repeating annotation groups for arrays
- richer condition operations
- true `truncate`, `wrap`, and `error` overflow strategies
- custom date patterns 
- more font support
- multi-page forms
- form-version compatibility checks
- validation of source value types
- richer renderer integrations

## Status

This repository contains a working reference implementation demonstrating the complete flow from structured data and annotations to a filled PDF.

---