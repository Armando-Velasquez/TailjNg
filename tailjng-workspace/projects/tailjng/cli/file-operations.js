
// file-operations.js
const fs = require("fs")
const path = require("path")
const { COLORS } = require("./settings/colors")
const { generateHeaderComment } = require("./settings/header-generator")
const { askOverwrite } = require("./settings/prompt-utils")
const { buildTargetPath, parseComponentPath } = require("./settings/path-utils")

async function copyComponentFiles(componentName, componentPath, isDependency = false) {
    // Detect the root directory where node_modules is located
    let currentDir = process.cwd()
    // Up to the root directory where node_modules is located
    while (!fs.existsSync(path.join(currentDir, "node_modules"))) {
        currentDir = path.dirname(currentDir)
        if (currentDir === path.dirname(currentDir)) {
            console.error(`${COLORS.red}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.red}ERROR: node_modules not found in project root.${COLORS.reset}`)
            process.exit(1)
        }
    }

    // Now currentDir points to the root directory where node_modules is located
    const nodeModulesPath = path.join(currentDir, "node_modules", "tailjng", componentPath)
    const projectRoot = process.cwd()

    // Use the new function to build the target path while maintaining the folder structure
    const targetPath = buildTargetPath(projectRoot, componentName, componentPath)
    const pathInfo = parseComponentPath(componentPath)

    // Check if the component exists in the correct path
    if (!fs.existsSync(nodeModulesPath)) {
        console.error(
            `${COLORS.red}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.red}ERROR: Component path ${COLORS.bright}"${nodeModulesPath}"${COLORS.reset} ${COLORS.red}does not exist.${COLORS.reset}`,
        )
        process.exit(1)
    }

    // Check if the target path already exists
    if (fs.existsSync(targetPath)) {
        const relativeTargetPath = path.relative(projectRoot, targetPath)
        const shouldOverwrite = await askOverwrite(componentName, relativeTargetPath, isDependency)

        if (!shouldOverwrite) {
            console.log(`${COLORS.dim}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.dim}Skipping ${COLORS.bright}"${componentName}"${COLORS.reset} ${COLORS.dim}- keeping existing version.${COLORS.reset}`)
            return false // Return false to indicate that it was not installed
        }

        // If decided to overwrite, remove the existing directory
        console.log(`${COLORS.yellow}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.yellow}Removing existing ${COLORS.bright}"${componentName}"${COLORS.reset} ${COLORS.yellow}to overwrite...${COLORS.reset}`)
        fs.rmSync(targetPath, { recursive: true, force: true })
    }

    const componentType = isDependency ? "dependency component" : "component"
    const relativeTargetPath = path.relative(projectRoot, targetPath)

    // See if the component has subfolders
    if (pathInfo.hasSubfolders) {
        console.log(
            `${COLORS.blue}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.blue}Copying ${componentType} ${COLORS.bright}"${componentName}"${COLORS.reset} (${pathInfo.fullSubPath}) → ${relativeTargetPath}${COLORS.reset}`,
        )
    } else {
        console.log(
            `${COLORS.blue}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.blue}Copying ${componentType} ${COLORS.bright}"${componentName}"${COLORS.reset} → ${relativeTargetPath}${COLORS.reset}`,
        )
    }

    // Create the target directory structure
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
        console.log(`${COLORS.green}${COLORS.bright}[tailjng CLI]${COLORS.reset} ${COLORS.green}Copied file: ${COLORS.bright}${file}${COLORS.reset}`)
    })

    return true // Return true to indicate that it was installed successfully
}

module.exports = { copyComponentFiles }
