var style_roads_2500_15000 = {
    "style": {
        "motorway (bridge)": {
            "colors": ["#888888", "#FD923A"],
            "widths": [12, 10],
            "caps": ["round", "round"],
            "opacity": 1,
            "andFilters": {"bridge": 1},
            "geometryName": "geometry"
        },
        "trunk (bridge)": {
            "colors": ["#888888", "#FFC345"],
            "widths": [12, 10],
            "caps": ["round", "round"],
            "opacity": 1,
            "andFilters": {"bridge": 1},
            "geometryName": "geometry",
            "textStyle": {}
        },
        "trunk_link (bridge)": {
            "colors": ["#C1B59D", "#EDC872"],
            "widths": [7, 4],
            "caps": ["round", "round"],
            "opacity": 1,
            "andFilters": {"bridge": 1},
            "geometryName": "geometry",
            "textStyle": {}
        },
        "primary (bundesstraßen bridge)": {
            "colors": ["#C1B59D", "#FFFD8B"],
            "widths": [11, 8],
            "caps": ["round", "round"],
            "opacity": 1,
            "andFilters": {"bridge": 1, "notEqualFilter": {"ref": ""}},
            "geometryName": "geometry"
        },
        "primary (bridge)": {
            "colors": ["#888888", "#FFFFFF"],
            "widths": [11, 9],
            "caps": ["round", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {},
            "andFilters": {"bridge": 1}
        },
        "primary_link (bridge)": {
            "colors": ["#888888", "#FFFFFF"],
            "widths": [11, 9],
            "caps": ["round", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {},
            "andFilters": {"bridge": 1}
        },
        "secondary (bridge)": {
            "colors": ["#888888", "#FFFFFF"],
            "widths": [10, 8],
            "caps": ["round", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {},
            "andFilters": {"bridge": 1}
        },
        "secondary_link (bridge)": {
            "colors": ["#888888", "#FFFFFF"],
            "widths": [10, 8],
            "caps": ["round", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {},
            "andFilters": {"bridge": 1}
        },
        "tertiary (bridge)": {
            "colors": ["#888888", "#FFFFFF"],
            "widths": [9, 7],
            "caps": ["round", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {},
            "andFilters": {"bridge": 1}
        },
        "tertiary_link (bridge)": {
            "colors": ["#888888", "#FFFFFF"],
            "widths": [9, 7],
            "caps": ["round", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {},
            "andFilters": {"bridge": 1}
        },
        "pedestrian (bridge)": {
            "colors": ["#888888", "#FAFAF5"],
            "widths": [5.5, 3.5],
            "caps": ["round", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {}, 
            "andFilters": {"bridge": 1}
        },
        "rail": {
            "colors": ["#919191"],
            "dasharray": "2.0 2.0",
            "widths": [1],
            "caps": ["BUTT"],
            "opacity": 1,
            "geometryName": "geometry",
            "textStyle": {}
        },
        "motorway": {
            "colors": ["#BA6E27", "#FD923A"],
            "widths": [12, 10],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry"
        },
        "motorway_link (bridge)": {
            "colors": ["#BA6E27", "#FEC392"],
            "widths": [6, 5],
            "caps": ["round", "round"],
            "opacity": 1,
            "andFilters": {"bridge": 1},
            "geometryName": "geometry"
        },
        "motorway (tunnel)": {
            "colors": ["#FD923A"],
            "widths": [10],
            "caps": ["round"],
            "opacity": 0.4,
            "andFilters": {"tunnel": 1},
            "geometryName": "geometry"
        },
        "motorway_link": {
            "colors": ["#BA6E27", "#FEC392"],
            "widths": [6, 5],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry"
        },
        "motorway_link (tunnel)": {
            "colors": ["#FD923A"],
            "widths": [9],
            "caps": ["round"],
            "opacity": 0.4,
            "andFilters": {"tunnel": 1},
            "geometryName": "geometry"
        },
        "trunk": {
            "colors": ["#DD9F11", "#FFC345"],
            "widths": [12, 10],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry",
            "textStyle": {}
        },
        "trunk (tunnel)": {
            "colors": ["#FFC345"],
            "widths": [10],
            "caps": ["round"],
            "opacity": 0.4,
            "andFilters": {"tunnel": 1},
            "geometryName": "geometry",
            "textStyle": {}
        },
        "trunk_link": {
            "colors": ["#C1B59D", "#EDC872"],
            "widths": [7, 4],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry",
            "textStyle": {}
        },
        "trunk_link (tunnel)": {
            "colors": ["#FFC345"],
            "widths": [7],
            "caps": ["round"],
            "opacity": 0.4,
            "andFilters": {"tunnel": 1},
            "geometryName": "geometry",
            "textStyle": {}
        },
        "primary (bundesstraßen)": {
            "colors": ["#C1B59D", "#FFFD8B"],
            "widths": [11, 8],
            "caps": ["round", "round"],
            "opacity": 1,
            "andFilters": {"notEqualFilter": {"ref": ""}},
            "geometryName": "geometry",
            "textStyle": {}
        },
        "primary": {
            //"colors": ["#C1B59D", "#FFFFFF"],
        	// setting the following for yellow primaries, till we have filtering...
        	"colors": ["#C1B59D", "#FFFD8B"],
            "widths": [11, 8],
            "caps": ["round", "round"],
            "opacity": 1,
            "andFilters": {"ref": ""},
            "geometryName": "geometry",
            "textStyle": {}
        },
        "primary (tunnel)": {
            "colors": ["#FFFFFF"],
            "widths": [9],
            "caps": ["round"],
            "opacity": 0.4,
            "andFilters": {"tunnel": 1},
            "geometryName": "geometry",
            "textStyle": {}
        },
        "primary_link": {
            "colors": ["#888888", "#FFFFFF"],
            "widths": [11,9],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry",
            "textStyle": {}
        },
        "primary_link (tunnel)": {
            "colors": ["#FFFFFF"],
            "widths": [9],
            "caps": ["round"],
            "opacity": 0.4,
            "geometryName": "geometry",
            "textStyle": {},
            "andFilters": {"tunnel": 1}
        },
        "secondary": {
            "colors": ["#C1B59D", "#FFFFFF"],
            "widths": [10, 7],
            "caps": ["round", "round"],
            "opacity": 1,
            "textStyle": {},
            "geometryName": "geometry"
        },
        "secondary (tunnel)": {
            "colors": ["#FFFFFF"],
            "widths": [8],
            "caps": ["round"],
            "opacity": 0.4,
            "geometryName": "geometry",
            "textStyle": {},
            "andFilters": {"tunnel": 1}
        },
        "secondary_link": {
            "colors": ["#888888", "#FFFFFF"],
            "widths": [10,8],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry",
            "textStyle": {}
        },
        "secondary_link (tunnel)": {
            "colors": ["#FFFFFF"],
            "widths": [8],
            "caps": ["round"],
            "opacity": 0.4,
            "andFilters": {"tunnel": 1},
            "geometryName": "geometry",
            "textStyle": {}
        },
        "tertiary": {
            "colors": ["#C1B59D", "#FFFFFF"],
            "widths": [9, 6],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry",
            "textStyle": {}
        },
        "tertiary (tunnel)": {
            "colors": ["#FFFFFF"],
            "widths": [7],
            "caps": ["round"],
            "opacity": 0.4,
            "geometryName": "geometry",
            "textStyle": {},
            "andFilters": {"tunnel": 1}
        },
        "tertiary_link": {
            "colors": ["#888888", "#FFFFFF"],
            "widths": [9, 7],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry",
            "textStyle": {}
        },
        "tertiary_link (tunnel)": {
            "colors": ["#FFFFFF"],
            "widths": [7],
            "caps": ["round"],
            "opacity": 0.4,
            "geometryName": "geometry",
            "textStyle": {},
            "andFilters": {"tunnel": 1}
        },
        "classified": {
            "colors": ["#888888", "#FFFFFF"],
            "widths": [8, 6],
            "caps": ["BUTT", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {},
            "andFilters": {"bridge": 1}
        },
        "unclassified": {
            "colors": ["#C1B59D", "#FFFFFF"],
            "widths": [8, 6],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry",
            "textStyle": {}
        },
        "residential": {
            "colors": ["#C1B59D", "#FFFFFF"],
            "widths": [8, 6],
            "caps": ["round", "round"],
            "opacity": 1,
            "geometryName": "geometry",
            "textStyle": {}
        },
        "service": {
            "colors": ["#C1B59D", "#FFFFFF"],
            "widths": [8, 6],
            "caps": ["round", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {}
        },
        "road": {
            "colors": ["#C1B59D", "#FFFFFF"],
            "widths": [8, 6],
            "caps": ["round", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {}
        },
        "living_street": {
            "colors": ["#C1B59D", "#FFFFFF"],
            "widths": [8, 6],
            "caps": ["round", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {}
        },
        "pedestrian": {
            "colors": ["#C1B59D", "#FAFAF5"],
            "widths": [5.5, 3.5],
            "caps": ["round", "round"],
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {}
        },
        "track": {
            "colors": ["#C1B59D"],
            "widths": [1],
            "caps": ["round"],
            "dasharray": "2.0 3.0",
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {}
        },
        "footway": {
            "colors": ["#C1B59D"],
            "widths": [2],
            "caps": ["round"],
            "dasharray": "2.0 3.0",
            "opacity": 1, 
            "geometryName": "geometry",
            "textStyle": {}
        }
    }
};