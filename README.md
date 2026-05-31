# capdiag

Generates class diagrams from SAP CAP (Node.js) projects. Reads your CDS model and writes diagram files in Mermaid or PlantUML format.

## Requirements

Node.js >= 20.0.0

## Installation

```bash
npm install -g capdiag
```

## Usage

Run inside a CAP project directory (where `package.json` and your CDS files live):

```bash
capdiag [options]
```

## CLI Options

| Option | Alias | Default | Description |
|--------|-------|---------|-------------|
| `--type` | `-t` | `mermaid` | Diagram format. Choices: `mermaid`, `plantUML`. Overridden per diagram by the config file. |
| `--config` | | | Path to a configuration file. If omitted, capdiag looks for `.capdiag.json` in the current directory. |
| `--dir` | `-D` | `diagrams` | Directory in which to write the generated diagram files. Created automatically if it does not exist. |
| `--modelRoot` | `-m` | `.` | Root directory of the CDS model. All CDS files within it are loaded. Useful when running capdiag from outside the CAP project directory. |
| `--asMarkdown` | `-md` | `true` | Wrap Mermaid output in a ` ```mermaid ` code block, ready to embed in Markdown files. Ignored for other diagram types. |
| `--help` | `-h` | | Show help. |

## Configuration File

The configuration file is a JSON object. Each key is an output **filename** and its value is a **diagram configuration** object controlling what that diagram contains.

```json
{
  "overview.md": {
    "title": "My Service Overview",
    "includes": ["my.namespace.*"],
    "excludes": ["my.namespace.InternalEntity"],
    "noFields": false,
    "includeAssociationsToExcludedTargets": false
  },
  "admin.md": {
    "title": "Admin Entities",
    "includes": ["admin.*"]
  }
}
```

Output files are written to the directory specified by `--dir` (default: `diagrams/`).

If no config file is found, capdiag generates a single file `all.md` containing all entities with default settings.

### Diagram Configuration Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `title` | `string` | — | Title rendered at the top of the diagram. |
| `includes` | `string[]` | — | Whitelist of entity name patterns to include. Supports `*` as a wildcard. If omitted, all entities are included. |
| `excludes` | `string[]` | — | Blacklist of entity name patterns to exclude. Supports `*` as a wildcard. Applied after `includes`. |
| `noFields` | `boolean` | `false` | When `true`, entity fields are omitted — only class names and associations are rendered. |
| `includeAssociationsToExcludedTargets` | `boolean` | `false` | When `true`, associations pointing to entities that are not in the diagram are still rendered. |

### Pattern Syntax

`includes` and `excludes` entries are glob-style patterns matched against fully qualified entity names:

- `my.namespace.Entity` — exact match
- `my.namespace.*` — all entities in the namespace
- `*` — all entities

## Examples

### Minimal — all entities, default settings

Run without a config file:

```bash
capdiag
```

Generates `diagrams/all.md` as a Mermaid class diagram.

### PlantUML output

```bash
capdiag --type plantUML
```

### Custom output directory

```bash
capdiag --dir docs/diagrams
```

### Multiple diagrams from one config

`.capdiag.json`:

```json
{
  "public.md": {
    "title": "Public API",
    "includes": ["public.*"],
    "noFields": false
  },
  "internal.md": {
    "title": "Internal Model",
    "excludes": ["public.*"],
    "includeAssociationsToExcludedTargets": true
  }
}
```

```bash
capdiag
```

Generates `diagrams/public.md` and `diagrams/internal.md`.

## Samples

See [samples/README.md](samples/README.md) for ready-to-use configuration files based on the SAP CAP sample projects.
