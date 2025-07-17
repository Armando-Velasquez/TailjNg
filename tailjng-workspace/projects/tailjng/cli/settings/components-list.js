function getComponentList() {
    return {
        'mode-toggle': {
            path: "src/lib/components/mode-toggle",
            dependencies: [],
        },
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
        'input-file': {
            path: "src/lib/components/input/file-input",
            dependencies: [],
        },
        'input-textarea': {
            path: "src/lib/components/input/textarea-input",
            dependencies: [],
        },
        'input-range': {
            path: "src/lib/components/input/range-input",
            dependencies: [],
        },
        input: {
            path: "src/lib/components/input/input",
            dependencies: [],
        },
        'select-multi-table': {
            path: "src/lib/components/select/multi-table",
            dependencies: ["button"],
        },
        'select-multi-dropdown': {
            path: "src/lib/components/select/multi-dropdown",
            dependencies: [],
        },
        'select-dropdown': {
            path: "src/lib/components/select/dropdown",
            dependencies: [],
        },
        // Add more components as needed
    }
}

module.exports = { getComponentList }
