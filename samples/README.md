# capdiag Samples

Sample configuration files for the [SAP CAP samples](https://github.com/capire/samples) repository.

## Setup

Clone the CAP samples repository into a `cap/samples` directory next to your capdiag checkout:

```bash
git clone -j11 -q --recursive https://github.com/capire/samples cap/samples
```

Your directory structure should look like this:

```
cap/
  samples/
    orders/
    bookshop/
    reviews/
    ...
capdiag/
  samples/
    orders.capdiag.json
```

## Generating Diagrams

### Orders domain

Run from the `cap/samples` directory, pointing the model root at the `orders` sub-project:

```bash
cd cap/samples
capdiag -m orders --config <path to capdiag>/samples/orders.capdiag.json
```

The following diagrams are written to `cap/samples/diagrams/`:

- [orders.md](orders.md) — full class diagram with fields
- [orders_overview.md](orders_overview.md) — relationships-only overview, DRAFT entities excluded

## Configuration Files

| File | Description |
|------|-------------|
| `orders.capdiag.json` | Orders domain — full diagram and a relationships-only overview, DRAFT entities excluded. |

