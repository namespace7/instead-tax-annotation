# Annotation Specification

## 1. Overview

The annotation specification defines how structured tax data is mapped onto fields on a fixed PDF form.

An annotation describes:
- what data should be rendered
- where that data should appear
- how the value should be formatted
- when the annotation should be rendered
- how missing values and overflow should be handled

The specification is renderer-independent. PDF-specific implementation details are handled by the renderer.

---

## 2. Top-Level Structure

        {
            "schemaVersion" : "1.0",
            "form" : {
                "id" : "us-tax-demo",
                "taxYear" : 2025,
                "units" : "pt",
                "coordinateSystem" : "top-left"
            },
            "annotations" : []
        }

**schemaVersion**
Version of the annotation specification.

**form**
Describes the target form.
| Property          | Description                                   |
|-------------------|-----------------------------------------------|
| id                | Unique form identifier                        |
| taxYear           | Tax year associated with the form             |
| units             | Measurement units used by coordinates         |
| coordinateSystem  | Coordinate convention used by annotations     |

The current implementation supports:

- pt
- mm
- in

and:

- top-left
- bottom-left

The demo uses points(`pt`) and a top-left coordinate system.

---

## 3. Annotation

Each annotation represents one field on the form.

Example:

    {
        "id": "taxpayer.firstName",
        "type": "text",
        "source": {
            "path": "$.taxpayer.name.first"
        },
        "target": {
            "page": 1,
            "box": {
            "x": 120,
            "y": 105,
            "width": 150,
            "height": 20
            }
        }
    }

`id`
Unique identifier for the annotation.

it makes annotations easy to identify in logs, tests, and renderer instructions.

---

`type`
Defines the semantic type of the value.

Supported types:

    text
    number
    currency
    date
    percentage
    checkbox

The type determines how the value is converted into renderable output.

---

`source`

The `source.path` identifies the value in the input data.

The implementation supports a small JSONPath-like syntax.

Example:

    $.taxpayer.name.first
Given:

    {
        "taxpayer" : {
            "name" : {
                "first" : "Yashwant"
            }
        }
    }

the resolver returns:

    Yashwant

Array access is also supported:

    $.taxpayer.dependents[0].name.first

This deliberately implements a small predictable subset rather than the complete JSONPath specification.

---

`Target`

The target describes where the value belongs on the form.

    "target" : {
        "page": 1,
        "box": {
            "x": 120,
            "y": 105,
            "width": 150,
            "height": 20
        }
    }

The box represents the available rendering area.

Coordinates are defined relative to the coordinate system declared by the form.

---

`Formatting`

Formatting controls how a value appears.

Example: 

    "format": {
        "fontFamily": "Helvetica",
        "fontSize": 10,
        "alignment": "right",
        "verticalAlignment": "middle",
        "currency": "USD",
        "decimals": 2
    }

Supported formatting options include: 

- fontFamily
- fontSize
- alignment
- verticalAlignment
- currency
- decimals
- locale
- useGrouping

Examples:

    95000
    ↓
    $95,000.00

and:

    0.24
    ↓
    24.0%

---

`Behavior`

Behavior controls edge cases.

Example:

    "behavior": {
        "missingValue" : "skip",
        "overflow": "shrink",
        "minFontSize": 7
    }

## Missing values
Supported policies:

    skip
    empty
    error

`skip`
Do not generate a rendering instruction.

`empty`
Generate a rendering instruction with an empty value.

`error`
Stop processing and report the missing annotation.

---

## Overflow

Supported policies:

    shrink
    truncate
    wrap
    clip
    error

The current renderer implements the `shrink` behavior.

When text does not fit inside the target box, the font size is reduced until:

- the text fits, or 
- `minFontSize` is reached.

Other overflow policies are part of the specification and can be implemented by future renderers.

---

## Conditions

Conditions allow annotations to be rendered only when a condition is satisfied.

Example:

    {
        "id": "filing.single",
        "type": "checkbox",
        "source": {
            "path": "$.taxpayer.filingStatus"
        },
        "condition": {
            "operator": "equals",
            "value": "single"
        }
    }

if: 

    filingStatus = "single"

the engine produces:

    {
        "type": "checkbox",
        "checked": true
    }

if: 

    filingStatus = "married"

the annotation is skipped.

The renderer does not need to understand the business rule.

---

# Design principles

## Declarative
The annotation describe what should happen rather than implementing how it happens.

## Renderer-independent
The specification does not depend on `pdf-lib` or another PDF library.

## Explicit positioning
Every annotation can define an exact page and bounding box.

## predictable data access
Source paths use a small, documented JSONPath-like syntax.

## Extensible
New field types, formatting options, conditions, and renderer implementations can be added without redesigning the entire specification.

---


