// path-utils.js

const path = require("path")

/**
 * Extracts folder structure information from the component path
 * @param {string} componentPath - Path del componente (ej: "src/lib/components/alert/dialog-alert")
 * @returns {object} - Information about the folder structure
 */
function parseComponentPath(componentPath) {

    // Remove the base prefix "src/lib/components/"
    const basePath = "src/lib/components/"
    const relativePath = componentPath.replace(basePath, "")

    // Split the path into parts
    const pathParts = relativePath.split("/")

    // The last element is the component name
    const componentFolder = pathParts[pathParts.length - 1]

    // All except the last element are subfolders
    const subfolders = pathParts.slice(0, -1)

    return {
        componentFolder,
        subfolders,
        hasSubfolders: subfolders.length > 0,
        fullSubPath: subfolders.join("/"),
    }
}

/**
 * Make sure to keep the folder structure
 * @param {string} projectRoot - Project root directory
 * @param {string} componentName - Component name
 * @param {string} componentPath - Original component path
 * @returns {string} - Full target path
 */
function buildTargetPath(projectRoot, componentName, componentPath) {
    const pathInfo = parseComponentPath(componentPath)

    if (pathInfo.hasSubfolders) {
        // If it has subfolders, keep the structure
        return path.join(projectRoot, "src", "app", "tailjng", pathInfo.fullSubPath, componentName)
    } else {
        // If it doesn't have subfolders, use the original structure
        return path.join(projectRoot, "src", "app", "tailjng", componentName)
    }
}

module.exports = { parseComponentPath, buildTargetPath }
