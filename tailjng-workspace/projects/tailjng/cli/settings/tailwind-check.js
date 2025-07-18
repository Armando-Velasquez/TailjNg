// tailwind-check.js

const { COLORS } = require("./colors")

function checkTailwindInstalled() {
    try {
        require.resolve("tailwindcss")
        console.log(`${COLORS.green}[tailjng CLI] TailwindCSS is installed.${COLORS.reset}`)
    } catch (e) {
        console.warn(`${COLORS.yellow}
[tailjng CLI] WARNING:
------------------------------------------------------------
TailwindCSS is not installed in your project.
Please install it to ensure styles work properly:
    npm install tailwindcss
And generate the config:
    npx tailwindcss init
------------------------------------------------------------
${COLORS.reset}`)
    }
}

module.exports = { checkTailwindInstalled }
