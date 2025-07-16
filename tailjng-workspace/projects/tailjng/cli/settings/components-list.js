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
        'alert-dialog': {
            path: "src/lib/components/alert/dialog-alert",
            dependencies: ["button", "color"],
        },
        'alert-toast': {
            path: "src/lib/components/alert/toast-alert",
            dependencies: ["button", "color"],
        },
        // Add more components as needed
    }
}

module.exports = { getComponentList }
