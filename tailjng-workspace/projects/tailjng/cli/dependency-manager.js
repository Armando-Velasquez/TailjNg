const { copyComponentFiles } = require("./file-operations")
const { COLORS } = require("./settings/colors")

async function installDependencies(dependencies = [], componentList, installedComponents = new Set()) {
    if (dependencies.length === 0) {
        console.log(`${COLORS.dim}[tailjng CLI] No dependencies to install.${COLORS.reset}`)
        return
    }

    for (const dep of dependencies) {

        // Evit infinite loops by checking if the component was already processed
        if (installedComponents.has(dep)) {
            console.log(`${COLORS.dim}[tailjng CLI] Component "${dep}" already processed, skipping.${COLORS.reset}`)
            continue
        }

        const depComponentData = componentList[dep]
        if (!depComponentData) {
            console.error(
                `${COLORS.red}[tailjng CLI] ERROR: Dependency component "${dep}" not found in the component list.${COLORS.reset}`,
            )
            process.exit(1)
        }

        console.log(`${COLORS.magenta}[tailjng CLI] Installing dependency component: ${dep}${COLORS.reset}`)

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
                console.log(`${COLORS.green}[tailjng CLI] Successfully installed dependency: ${dep}${COLORS.reset}`)
            } else {
                console.log(`${COLORS.dim}[tailjng CLI] Dependency "${dep}" was skipped by user choice.${COLORS.reset}`)
            }
        } catch (err) {
            console.error(`${COLORS.red}[tailjng CLI] Failed to install dependency component: ${dep}${COLORS.reset}`)
            console.error(`${COLORS.red}[tailjng CLI] Error details:${COLORS.reset}`, err)
            process.exit(1)
        }
    }
}

module.exports = { installDependencies }
