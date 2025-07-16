const fs = require("fs")
const path = require("path")
const { copyComponentFiles } = require("./file-operations")
const { installDependencies } = require("./dependency-manager")
const { COLORS } = require("./settings/colors")

async function addComponent(componentName, componentList) {
    const componentData = componentList[componentName]
    if (!componentData) {
        console.error(
            `${COLORS.red}[tailjng CLI] ERROR: Component "${componentName}" not found in the component list.${COLORS.reset}`,
        )
        process.exit(1)
    }

    console.log(`${COLORS.blue}[tailjng CLI] Adding component: ${componentName}${COLORS.reset}`)

    // Create a Set to track already processed components
    const installedComponents = new Set()

    // Install dependencies first to ensure they are available before the main component
    await installDependencies(componentData.dependencies, componentList, installedComponents)

    // Check if the main component was already processed as a dependency
    if (!installedComponents.has(componentName)) {
        // Copy the main component files to the project
        const wasInstalled = await copyComponentFiles(componentName, componentData.path, false)

        if (wasInstalled) {
            console.log(
                `${COLORS.greenBright}[tailjng CLI] ✔ Component "${componentName}" installed successfully.${COLORS.reset}`,
            )
        } else {
            console.log(
                `${COLORS.yellow}[tailjng CLI] Component "${componentName}" installation was cancelled by user.${COLORS.reset}`,
            )
        }
    } else {
        console.log(
            `${COLORS.dim}[tailjng CLI] Main component "${componentName}" was already processed as a dependency.${COLORS.reset}`,
        )
    }
}

module.exports = { addComponent }
