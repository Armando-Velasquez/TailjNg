// components-list.js

function getComponentList() {
    return {
        'mode-toggle': {
            path: "src/lib/components/mode-toggle",
            dependencies: [],
        },
        'color': {
            path: "src/lib/components/color",
            dependencies: [],
        },
        'tooltip': {
            path: "src/lib/components/tooltip",
            dependencies: [],
        },
        'label': {
            path: "src/lib/components/label",
            dependencies: ["tooltip"],
        },
        'toggle-radio': {
            path: "src/lib/components/toggle-radio",
            dependencies: [],
        },
        'button': {
            path: "src/lib/components/button",
            dependencies: ["tooltip", "color"],
        },
        'checkbox-input': {
            path: "src/lib/components/checkbox/checkbox-input",
            dependencies: ["color"],
        },
        'checkbox-switch': {
            path: "src/lib/components/checkbox/checkbox-switch",
            dependencies: ["color"],
        },
        'alert-dialog': {
            path: "src/lib/components/alert/alert-dialog",
            dependencies: ["button", "color"],
        },
        'alert-toast': {
            path: "src/lib/components/alert/alert-toast",
            dependencies: ["button", "color"],
        },
        'progress-bar': {
            path: "src/lib/components/progress-bar",
            dependencies: [],
        },
        'image-viewer': {
            path: "src/lib/components/image/image-viewer",
            dependencies: ["button"],
        },
        'dialog': {
            path: "src/lib/components/dialog",
            dependencies: [],
        },
        'input-file': {
            path: "src/lib/components/input/input-file",
            dependencies: [],
        },
        'input-textarea': {
            path: "src/lib/components/input/input-textarea",
            dependencies: [],
        },
        'input-range': {
            path: "src/lib/components/input/input-range",
            dependencies: [],
        },
        'input': {
            path: "src/lib/components/input/input",
            dependencies: [],
        },
        'select-multi-table': {
            path: "src/lib/components/select/select-multi-table",
            dependencies: ["button"],
        },
        'select-multi-dropdown': {
            path: "src/lib/components/select/select-multi-dropdown",
            dependencies: [],
        },
        'select-dropdown': {
            path: "src/lib/components/select/select-dropdown",
            dependencies: [],
        },
        'form-container': {
            path: "src/lib/components/form/form-container",
            dependencies: [],
        },





        'theme-generator': {
            path: "src/lib/components/theme-generator",
            dependencies: ["input", "input-range", "button", "label", "form-container"],
        },
    }
}

module.exports = { getComponentList }
