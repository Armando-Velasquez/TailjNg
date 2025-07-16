function getComponentList() {
    return {
        color: {
            path: "src/lib/components/color",
            dependencies: [],
        },
        tooltip: {
            path: "src/lib/components/tooltip",
            dependencies: [],
        },
        label: {
            path: "src/lib/components/label",
            dependencies: ["tooltip"],
        },
        'toggle-radio': {
            path: "src/lib/components/toggle-radio",
            dependencies: [],
        },
        button: {
            path: "src/lib/components/button",
            dependencies: ["tooltip", "color"],
        },
        // Add more components as needed
    }
}

module.exports = { getComponentList }
