# katte-fakta

A simple website displaying random Norwegian cat facts, built with Zola static site generator.

## Technologies used
* Zola (static site generator)
* HTML/CSS (with Tailwind-inspired styles)
* JavaScript (for random fact selection)

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

### Building for Production

To build the static site:
```bash
zola build
```

The generated site will be available in the `public/` directory.

## Project Structure

- `config.toml` - Zola configuration file
- `content/` - Markdown content files
- `templates/` - HTML templates (using Tera templating engine)
- `public/` - Generated site output (excluded from git)
