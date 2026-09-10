# Architecture

                 TAX DATA
                    │
                    ▼
          annotations.json
                    │
                    ▼
             ┌─────────────┐
             │   ENGINE    │
             │             │
             │ resolve     │
             │ condition   │
             │ format      │
             └──────┬──────┘
                    │
                    ▼
        Renderer Instructions
                    │
                    ▼
             ┌─────────────┐
             │  RENDERER   │
             │             │
             │ coordinates │
             │ alignment   │
             │ text        │
             │ checkbox    │
             └──────┬──────┘
                    │
                    ▼
              Filled PDF