# dn_constraintsextent

The Constraints Extent bundle allows allows you to restrict the allowed extent.

## Usage

1. First you need to add the bundle dn_constraintsextent to your app.
2. Then you need to configure it.

## Configuration Reference

### Config

#### Sample configuration
```json
"Config": {
    "expandValue": 1.5,
    "maxExtentGeometry": {
        "xmin": 753914.6294,
        "ymin": 6591356.799400002,
        "xmax": 797273.3093999997,
        "ymax": 6636338.486199997,
        "spatialReference": {
            "wkid": 3857
        }
    }
}
```

| Property          | Type   | Possible Values | Default   | Description                                                      |
|-------------------|--------|-----------------|-----------|------------------------------------------------------------------|
| expandValue       | Number |                 | ```1.2``` | Expands the input geometry extent by the given factor.           |
| maxExtentGeometry | Object |                 |           | Input geometry whose extent defines the maximum possible extent. |
