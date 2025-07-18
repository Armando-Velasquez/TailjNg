#!/usr/bin/env node

// index.js
const { checkTailwindInstalled } = require("./settings/tailwind-check")
const { addComponent, installAllComponents } = require("./component-manager")
const { getComponentList } = require("./settings/components-list")
const { COLORS } = require("./settings/colors")

const args = process.argv.slice(2)
const command = args[0]

async function main() {
    if (command === "add") {
        const componentName = args[1]
        if (!componentName) {
            console.error(`${COLORS.red}[tailjng CLI] ERROR: Please specify a component name.${COLORS.reset}`)
            console.log(`${COLORS.cyan}Usage: npx tailjng add <componentName>${COLORS.reset}`)
            process.exit(1)
        }
        checkTailwindInstalled()
        await addComponent(componentName, getComponentList())
    } else if (command === "list") {
        showComponentList()
    } else if (command === "install-all") {
        checkTailwindInstalled()
        await installAllComponents(getComponentList())
    } else {
        console.log(`${COLORS.bright}${COLORS.blue}Usage:${COLORS.reset}
  ${COLORS.cyan}${COLORS.bright}npx tailjng${COLORS.reset} ${COLORS.bright}${COLORS.green}add${COLORS.reset} ${COLORS.dim}<componentName>${COLORS.reset}      ${COLORS.blue}Add a component to your project${COLORS.reset}
  ${COLORS.cyan}${COLORS.bright}npx tailjng${COLORS.reset} ${COLORS.bright}${COLORS.green}list${COLORS.reset}                     ${COLORS.blue}List all available components${COLORS.reset}
  ${COLORS.cyan}${COLORS.bright}npx tailjng${COLORS.reset} ${COLORS.bright}${COLORS.green}install-all${COLORS.reset}              ${COLORS.blue}Install all available components${COLORS.reset}`)
    }
}

function showComponentList() {
    const componentList = getComponentList()
    if (Object.keys(componentList).length === 0) {
        console.log(`${COLORS.yellow}[tailjng CLI] No components available.${COLORS.reset}`)
        return
    }

    console.log(`${COLORS.cyan}[tailjng CLI] Available components:${COLORS.reset}`)
    for (const component in componentList) {
        const dependencies =
            componentList[component].dependencies.length > 0 ? componentList[component].dependencies.join(", ") : "None"
        console.log(
            `${COLORS.green}- ${component}${COLORS.reset} ${COLORS.dim}(Dependencies: ${dependencies})${COLORS.reset}`,
        )
    }
}

// Execute the main function
main().catch((error) => {
    console.error(`${COLORS.red}[tailjng CLI] Unexpected error:${COLORS.reset}`, error)
    process.exit(1)
})
