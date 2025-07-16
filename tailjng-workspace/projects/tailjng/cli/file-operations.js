const fs = require("fs")
const path = require("path")
const { COLORS } = require("./settings/colors")
const { generateHeaderComment } = require("./settings/header-generator")
const { askOverwrite } = require("./settings/prompt-utils")

async function copyComponentFiles(componentName, componentPath, isDependency = false) {

    // Detect the root directory where node_modules is located
    let currentDir = process.cwd()

    // Up to the root directory where node_modules is located
    while (!fs.existsSync(path.join(currentDir, "node_modules"))) {
        currentDir = path.dirname(currentDir)
        if (currentDir === path.dirname(currentDir)) {
            console.error(`${COLORS.red}[tailjng CLI] ERROR: node_modules not found in project root.${COLORS.reset}`)
            process.exit(1)
        }
    }

    // Now currentDir points to the root directory where node_modules is located
    const nodeModulesPath = path.join(currentDir, "node_modules", "tailjng", componentPath)
    const projectRoot = process.cwd()
    const targetPath = path.join(projectRoot, "src", "app", "tailjng", componentName)

    // Check if the component exists in the correct path
    if (!fs.existsSync(nodeModulesPath)) {
        console.error(
            `${COLORS.red}[tailjng CLI] ERROR: Component path "${nodeModulesPath}" does not exist.${COLORS.reset}`,
        )
        process.exit(1)
    }

    // Check if the target path already exists
    if (fs.existsSync(targetPath)) {
        const shouldOverwrite = await askOverwrite(componentName, path.relative(projectRoot, targetPath), isDependency)

        if (!shouldOverwrite) {
            console.log(`${COLORS.dim}[tailjng CLI] Skipping "${componentName}" - keeping existing version.${COLORS.reset}`)
            return false // Return false to indicate that it was not installed
        }

        // If decided to overwrite, remove the existing directory
        console.log(`${COLORS.yellow}[tailjng CLI] Removing existing "${componentName}" to overwrite...${COLORS.reset}`)
        fs.rmSync(targetPath, { recursive: true, force: true })
    }

    const componentType = isDependency ? "dependency component" : "component"
    console.log(
        `${COLORS.blue}[tailjng CLI] Copying ${componentType} "${componentName}" → ${path.relative(projectRoot, targetPath)}${COLORS.reset}`,
    )
    fs.mkdirSync(targetPath, { recursive: true })

    const files = fs.readdirSync(nodeModulesPath)
    files.forEach((file) => {
        const srcFile = path.join(nodeModulesPath, file)
        const destFile = path.join(targetPath, file)
        let content = fs.readFileSync(srcFile, "utf8")

        // Add header comment to the content
        const headerComment = generateHeaderComment(file)
        content = headerComment + "\n\n" + content

        // Here you can add more processing logic if needed
        // For example, replace imports, etc.

        fs.writeFileSync(destFile, content)
        console.log(`${COLORS.green}[tailjng CLI] Copied file: ${file}${COLORS.reset}`)
    })

    return true // Return true to indicate that it was installed successfully
}

module.exports = { copyComponentFiles }
