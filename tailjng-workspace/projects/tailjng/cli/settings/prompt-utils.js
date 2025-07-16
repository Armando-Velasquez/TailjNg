const readline = require("readline")
const { COLORS } = require("./colors")

function createReadlineInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    })
}

function askQuestion(question) {
    return new Promise((resolve) => {
        const rl = createReadlineInterface()
        rl.question(question, (answer) => {
            rl.close()
            resolve(answer.toLowerCase().trim())
        })
    })
}

async function askOverwrite(componentName, targetPath, isDependency = false) {
    const componentType = isDependency ? "dependency component" : "component"

    console.log(
        `${COLORS.yellow}⚠  [tailjng CLI] WARNING: ${componentType} "${componentName}" already exists!${COLORS.reset}`,
    )
    console.log(`${COLORS.dim}   Path: ${targetPath}${COLORS.reset}`)
    console.log(
        `${COLORS.yellow}   This component may have been modified. Overwriting will replace your changes.${COLORS.reset}`,
    )

    const answer = await askQuestion(`${COLORS.cyan}   Do you want to overwrite it? (y/N): ${COLORS.reset}`)

    return answer === "y" || answer === "yes"
}

module.exports = { askOverwrite }
