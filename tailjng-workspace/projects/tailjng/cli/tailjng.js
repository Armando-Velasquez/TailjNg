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
    white: "\x1b[37m",
    greenBright: "\x1b[92m"
};

// Paths
const packageRoot = path.resolve(__dirname, '..');
const componentsPath = path.join(packageRoot, 'src', 'lib', 'components');
const servicesPath = path.join(packageRoot, 'src', 'lib', 'services');

const args = process.argv.slice(2);
const command = args[0];

const installedComponents = new Set();

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
    if (installedComponents.has(componentName)) {
        console.log(`${COLORS.dim}[tailjng CLI] Component "${componentName}" already installed, skipping.${COLORS.reset}`);
        return;
    }

    installedComponents.add(componentName);

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

        const servicesFound = [];
        const servicesToCopy = [];

        // Encontrar importaciones de servicios
        content = content.replace(
            /import\s+\{\s*(\w+)\s*\}\s+from\s+['"]\.\.\/\.\.\/services\/(.*?)['"]\s*;?/g,
            (fullMatch, serviceName, servicePath) => {
                if (serviceName === 'JColorsService') {
                    // Este servicio debe copiarse al proyecto
                    console.log(`${COLORS.magenta}[tailjng CLI] Detected special service "${serviceName}". It will be copied instead of imported from tailjng.${COLORS.reset}`);

                    // Copiar archivo
                    const sourceServiceFile = path.join(servicesPath, servicePath);
                    const targetServiceDir = path.join(projectRoot, 'src', 'app', 'tailjng', 'services');
                    const targetServiceFile = path.join(targetServiceDir, path.basename(servicePath));

                    if (!fs.existsSync(sourceServiceFile)) {
                        console.warn(`${COLORS.yellow}[tailjng CLI] WARNING: Service file "${sourceServiceFile}" not found. Skipping copy.${COLORS.reset}`);
                    } else {
                        fs.mkdirSync(targetServiceDir, { recursive: true });
                        fs.copyFileSync(sourceServiceFile, targetServiceFile);
                        console.log(`${COLORS.green}[tailjng CLI] Copied service file: ${path.relative(projectRoot, targetServiceFile)}${COLORS.reset}`);
                    }

                    // Mantener el import relativo como está
                    return fullMatch;
                } else {
                    servicesFound.push(serviceName);
                    return '';
                }
            }
        );

        if (servicesFound.length > 0) {
            // Eliminar líneas en blanco
            content = content.replace(/^\s*[\r\n]/gm, '');

            // Agregar import consolidado
            const consolidatedImport = `import { ${servicesFound.join(', ')} } from 'tailjng';\n\n`;
            content = consolidatedImport + content;
        }

        // Analizar dependencias de otros componentes
        const componentMatches = [...content.matchAll(/import\s+.*\s+from\s+['"]\.\.\/(\w+)\/.*['"]/g)];

        for (const match of componentMatches) {
            const dependentComponent = match[1];

            if (!installedComponents.has(dependentComponent)) {
                console.log(`${COLORS.magenta}[tailjng CLI] Detected dependency on component "${dependentComponent}". Installing it...${COLORS.reset}`);
                addComponent(dependentComponent);
            }
        }

        // Agregar cabecera
        const headerComment = generateHeaderComment(file);
        content = headerComment + '\n' + content;

        fs.writeFileSync(destFile, content);
        console.log(`${COLORS.green}[tailjng CLI] Copied file: ${file}${COLORS.reset}`);
    }

    console.log(`${COLORS.greenBright || COLORS.green}\n[tailjng CLI] ✅ Component "${componentName}" copied successfully.${COLORS.reset}`);
}

function generateHeaderComment(fileName) {
    const headerContent = `===============================================
Librería de Componentes y Funciones - tailjNg
===============================================
Descripción:
  Esta librería está diseñada para ofrecer un conjunto de componentes reutilizables y funciones
  optimizadas para facilitar el desarrollo de interfaces de usuario y la gestión de datos en aplicaciones 
  web. Incluye herramientas para mejorar la experiencia del desarrollador y la interacción con el usuario.
Propósito:
  - Crear componentes modulares y personalizables.
  - Mejorar la eficiencia del desarrollo front-end mediante herramientas reutilizables.
  - Proporcionar soluciones escalables y fáciles de integrar con aplicaciones existentes.
Uso:
  Para obtener la funcionalidad completa, simplemente importa los módulos necesarios y usa los 
  componentes según tu caso de uso. Asegúrate de revisar la documentación oficial para obtener ejemplos 
  detallados sobre su implementación y personalización.
Autores:
  Armando Josue Velasquez Delgado - Desarrollador principal
Licencia:
  Este proyecto está licenciado bajo la BSD 3-Clause - ver el archivo LICENSE para más detalles.
Versión: 0.0.9
Fecha de creación: 2025-01-04
===============================================`;

    const ext = path.extname(fileName).toLowerCase();

    if (ext === '.ts' || ext === '.js' || ext === '.css' || ext === '.scss') {
        return `/*\n${headerContent}\n*/`;
    } else if (ext === '.html') {
        return `<!--\n${headerContent}\n-->`;
    } else {
        return `/*\n${headerContent}\n*/`;
    }
}
