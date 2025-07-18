// component-manager.js

const fs = require("fs")
const path = require("path")
const { copyComponentFiles } = require("./file-operations")
const { installDependencies } = require("./dependency-manager")
const { COLORS } = require("./settings/colors")

async function addComponent(componentName, componentList) {
    const componentData = componentList[componentName]
    if (!componentData) {
        console.error(
            `${COLORS.red}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.red}ERROR: Component ${COLORS.bright}"${componentName}"${COLORS.reset} ${COLORS.red}not found in the component list.${COLORS.reset}`,
        )
        process.exit(1)
    }

    console.log(`${COLORS.blue}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.blue}Adding component: ${COLORS.bright}"${componentName}"${COLORS.reset}`)

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
                `${COLORS.greenBright}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.greenBright}✔ Component ${COLORS.bright}"${componentName}"${COLORS.reset} ${COLORS.greenBright}installed successfully.${COLORS.reset}`,
            )
        } else {
            console.log(
                `${COLORS.yellow}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.yellow}Component ${COLORS.bright}"${componentName}"${COLORS.reset} ${COLORS.yellow}installation was cancelled by user.${COLORS.reset}`,
            )
        }
    } else {
        console.log(
            `${COLORS.dim}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.dim}Main component ${COLORS.bright}"${componentName}"${COLORS.reset} ${COLORS.dim}was already processed as a dependency.${COLORS.reset}`,
        )
    }
}


async function installAllComponents(componentList) {
    console.log(`${COLORS.blue}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.blue}Installing all components...${COLORS.reset}`)

    const installedComponents = new Set()

    for (const componentName of Object.keys(componentList)) {
        if (!installedComponents.has(componentName)) {
            await installDependencies(componentList[componentName].dependencies, componentList, installedComponents)

            if (!installedComponents.has(componentName)) {
                const wasInstalled = await copyComponentFiles(componentName, componentList[componentName].path, false)
                if (wasInstalled) {
                    console.log(`${COLORS.greenBright}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.greenBright}✔ Component ${COLORS.bright}"${componentName}"${COLORS.reset} ${COLORS.greenBright}installed successfully.${COLORS.reset}`)
                } else {
                    console.log(`${COLORS.yellow}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.yellow}Component ${COLORS.bright}"${componentName}"${COLORS.reset} ${COLORS.yellow}installation was skipped by user.${COLORS.reset}`)
                }
            }
        }
    }

    console.log(`${COLORS.greenBright}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.greenBright}✔ All components processed.${COLORS.reset}`)
}

module.exports = { addComponent, installAllComponents }
