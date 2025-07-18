// dependency-manager.js

const { copyComponentFiles } = require("./file-operations")
const { COLORS } = require("./settings/colors")

async function installDependencies(dependencies = [], componentList, installedComponents = new Set()) {
    if (dependencies.length === 0) {
        console.log(`${COLORS.dim}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.dim}No dependencies to install.${COLORS.reset}`)
        return
    }

    for (const dep of dependencies) {
        // Avoid infinite loops by checking if the component was already processed
        if (installedComponents.has(dep)) {
            console.log(`${COLORS.dim}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.dim}Component ${COLORS.bright}"${dep}"${COLORS.reset} ${COLORS.dim}already processed, skipping.${COLORS.reset}`)
            continue
        }

        const depComponentData = componentList[dep]
        if (!depComponentData) {
            console.error(
                `${COLORS.red}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.red}ERROR: Dependency component ${COLORS.bright}"${dep}" ${COLORS.red}not found in the component list.${COLORS.reset}`,
            )
            process.exit(1)
        }

        console.log(`${COLORS.magenta}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.magenta}Installing dependency component: ${COLORS.bright}"${dep}"${COLORS.reset}`)

        // Mark as processed before installing to avoid infinite loops
        installedComponents.add(dep)

        // Install recursively the dependencies of this dependency
        if (depComponentData.dependencies && depComponentData.dependencies.length > 0) {
            await installDependencies(depComponentData.dependencies, componentList, installedComponents)
        }

        // Copy the dependent component files
        try {
            const wasInstalled = await copyComponentFiles(dep, depComponentData.path, true)

            if (wasInstalled) {
                console.log(`${COLORS.green}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.green}Successfully installed dependency: ${COLORS.bright}"${dep}"${COLORS.reset}`)
            } else {
                console.log(`${COLORS.dim}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.dim}Dependency ${COLORS.bright}"${dep}"${COLORS.reset} ${COLORS.dim}was skipped by user choice.${COLORS.reset}`)
            }
        } catch (err) {
            console.error(`${COLORS.red}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.red}Failed to install dependency component: ${COLORS.bright}"${dep}"${COLORS.reset}`)
            console.error(`${COLORS.red}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.red}Error details:${COLORS.reset}`, err)
            process.exit(1)
        }
    }
}

module.exports = { installDependencies }
