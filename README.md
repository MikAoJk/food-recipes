# Food recipes

A simple website displaying food recipes, built with Zola static site generator.

## Technologies used
* Zola (static site generator)
* Elasticlunr.js (client-side search)

## Features
* **Client-side Search**: Fast, full-text search across all recipes
  - Search by recipe title, ingredients, or instructions
  - Real-time search results as you type
  - Debounced input for optimal performance
  - Keyboard support (Escape to clear)
  - Works on both desktop and mobile

## Getting Started

### Prerequisites
Make sure you have Zola installed. See [Zola Installation Guide](https://www.getzola.org/documentation/getting-started/installation/) for platform-specific instructions.

You can check which Zola version you have installed:
```bash
zola --version
```

### Development

To start the development server:
```bash
zola serve
```

This will start a local server at [http://127.0.0.1:1111](http://127.0.0.1:1111) with hot-reload enabled.

The search functionality will work automatically in development mode.

### Building for Production

To build the static site:
```bash
zola build
```

The generated site will be available in the `public/` directory.

**Note**: The build process automatically generates:
- `elasticlunr.min.js` - The search library
- `search_index.no.json` - The search index with all recipe content

## Search Configuration

The search functionality is configured in `config.toml`:

```toml
# Enable search index generation
build_search_index = true

[search]
index_format = "elasticlunr_json"
include_title = true
include_content = true
include_description = true
truncate_content_length = 1000
```

If you modify the search configuration, rebuild the site for changes to take effect.
