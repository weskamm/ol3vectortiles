var style_roads_1000000_2500000 = {
    "style": {
        "motorway (bridge)": {
            "colors": ["#888888", "#FD923A"],
            "widths": [2,1],
            "caps": ["round", "round"],
            "opacity": 1,
            "andFilters": {"bridge": 1},
            "geometryName": "geometry"
        },
        "trunk (bridge)": {
            "colors": ["#888888", "#FFC345"],
            "widths": [2,1],
            "caps": ["round", "round"],
            "opacity": 1,
            "andFilters": {"bridge": 1},
            "geometryName": "geometry"
        },
        "motorway": {
            "colors": ["#BA6E27", "#FD923A"],
            "widths": [2,1],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry"
        },
        "motorway (tunnel)": {
            "colors": ["#FD923A"],
            "widths": [2],
            "caps": ["round"],
            "opacity": 0.4,
            "andFilters": {"tunnel": 1},
            "geometryName": "geometry"
        },
        "trunk": {
            "colors": ["#DD9F11", "#FFC345"],
            "widths": [2,1],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry"
        },
        "trunk (tunnel)": {
            "colors": ["#FFC345"],
            "widths": [2],
            "caps": ["round"],
            "opacity": 0.4,
            "andFilters": {"tunnel": 1},
            "geometryName": "geometry"
        },
        "primary (bundesstraßen)": {
            "colors": ["#B5AC9A", "#FFFD8B"],
            "widths": [3,1],
            "caps": ["round", "round"],
            "opacity": 1,
            "andFilters": {"notEqualFilter": {"ref": ""}},
            "geometryName": "geometry"
        },
        "primary": {
            "colors": ["#C1B59D", "#FFFD8B"],
            "widths": [2,1],
            "caps": ["round", "round"],
            "opacity": 1,
            "andFilters": {"ref": ""},
            "geometryName": "geometry"
        }
    }
};
