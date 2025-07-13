#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Color helpers
const COLORS = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m"
};

// Determinar el root del paquete
const packageRoot = path.resolve(__dirname, '..');

// Path a los componentes dentro de la lib build
const componentsPath = path.join(packageRoot, 'src', 'lib', 'components');

const args = process.argv.slice(2);
const command = args[0];

if (command === 'add') {
    const componentName = args[1];
    checkTailwindInstalled();
    addComponent(componentName);
} else {
    console.log(`${COLORS.cyan}
Usage:
  npx tailjng add <component>
${COLORS.reset}`);
}

function checkTailwindInstalled() {
    try {
        require.resolve('tailwindcss');
        console.log(`${COLORS.green}[tailjng CLI] TailwindCSS is installed.${COLORS.reset}`);
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
${COLORS.reset}`);
    }
}

function addComponent(componentName) {
    const sourcePath = path.join(componentsPath, componentName);

    if (!fs.existsSync(sourcePath)) {
        console.error(`${COLORS.red}[tailjng CLI] ERROR: Component "${componentName}" does not exist at path: ${sourcePath}${COLORS.reset}`);
        process.exit(1);
    }

    const projectRoot = process.cwd();
    const targetPath = path.join(projectRoot, 'src', 'app', 'tailjng', componentName);

    console.log(`${COLORS.blue}[tailjng CLI] Copying component "${componentName}" → ${path.relative(projectRoot, targetPath)}${COLORS.reset}`);

    fs.mkdirSync(targetPath, { recursive: true });

    const files = fs.readdirSync(sourcePath);

    for (const file of files) {
        const srcFile = path.join(sourcePath, file);
        const destFile = path.join(targetPath, file);

        let content = fs.readFileSync(srcFile, 'utf8');

        // Analizar si necesita algún servicio de la librería
        const serviceMatches = [...content.matchAll(/import\s+\{\s*(\w+)\s*\}\s+from\s+['"]\.\.\/\.\.\/services\/(.*?)['"]/g)];

        for (const match of serviceMatches) {
            const serviceName = match[1];
            console.log(`${COLORS.yellow}[tailjng CLI] Updating import of service "${serviceName}" to tailjng.${COLORS.reset}`);

            // ✅ Reescribir el import en el componente generado:
            content = content.replace(
                match[0],
                `import { ${serviceName} } from 'tailjng'`
            );
        }

        fs.writeFileSync(destFile, content);
        console.log(`${COLORS.green}[tailjng CLI] Copied file: ${file}${COLORS.reset}`);
    }

    console.log(`${COLORS.greenBright || COLORS.green}\n[tailjng CLI] ✅ Component "${componentName}" copied successfully.${COLORS.reset}`);
}
