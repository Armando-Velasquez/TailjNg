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
        'input-checkbox': {
            path: "src/lib/components/checkbox/input-checkbox",
            dependencies: ["color"],
        },
        'switch-checkbox': {
            path: "src/lib/components/checkbox/switch-checkbox",
            dependencies: ["color"],
        },
        'alert-dialog': {
            path: "src/lib/components/alert/dialog-alert",
            dependencies: ["button", "color"],
        },
        'alert-toast': {
            path: "src/lib/components/alert/toast-alert",
            dependencies: ["button", "color"],
        },
        'progress-bar': {
            path: "src/lib/components/progress-bar",
            dependencies: [],
        },
        'viewer-image': {
            path: "src/lib/components/image/viewer-image",
            dependencies: ["button"],
        },
        dialog: {
            path: "src/lib/components/dialog",
            dependencies: [],
        },
        // Add more components as needed
    }
}

module.exports = { getComponentList }
