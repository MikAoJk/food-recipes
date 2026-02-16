# Food recipes

A simple website displaying food recipes, built with Zola static site generator.

## Technologies used
* Zola (static site generator)
* Elasticlunr.js (client-side search)

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
