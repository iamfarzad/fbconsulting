const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("🔍 Checking Vite installation issues...");

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), "node_modules");
const nodeModulesExists = fs.existsSync(nodeModulesPath);

console.log(
  `📁 node_modules directory ${nodeModulesExists ? "exists" : "does not exist"}`
);

// Check if vite is installed
const vitePath = path.join(process.cwd(), "node_modules", "vite");
const viteExists = fs.existsSync(vitePath);

console.log(
  `📦 Vite package ${viteExists ? "is installed" : "is not installed"}`
);

// Check for package.json
const packageJsonPath = path.join(process.cwd(), "package.json");
const packageJsonExists = fs.existsSync(packageJsonPath);

console.log(
  `📄 package.json ${packageJsonExists ? "exists" : "does not exist"}`
);

if (packageJsonExists) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    console.log("📊 Dependencies check:");
    console.log(
      `  - Vite listed in dependencies: ${
        packageJson.dependencies && packageJson.dependencies.vite ? "Yes" : "No"
      }`
    );
    console.log(
      `  - Vite listed in devDependencies: ${
        packageJson.devDependencies && packageJson.devDependencies.vite
          ? "Yes"
          : "No"
      }`
    );
  } catch (error) {
    console.error("❌ Error parsing package.json:", error.message);
  }
}

console.log("\n🔧 Attempting to fix the issue...");

// First, try reinstalling dependencies
try {
  console.log("📦 Reinstalling dependencies...");
  execSync("npm install", { stdio: "inherit" });
  console.log("✅ Dependencies reinstalled");
} catch (error) {
  console.error("❌ Error reinstalling dependencies:", error.message);
}

// Check if npx is available as a fallback
try {
  console.log("\n🔍 Checking if npx can run vite...");
  execSync("npx --no-install vite --version", { stdio: "inherit" });
  console.log("✅ Vite can be run via npx");

  // Update scripts to use npx
  if (packageJsonExists) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

      if (packageJson.scripts) {
        console.log("📝 Updating scripts to use npx...");

        if (packageJson.scripts.dev) {
          packageJson.scripts.dev = "npx --no-install vite";
        }

        if (packageJson.scripts.build) {
          packageJson.scripts.build = "npx --no-install vite build";
        }

        if (packageJson.scripts.preview) {
          packageJson.scripts.preview = "npx --no-install vite preview";
        }

        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log("✅ Scripts updated");
      }
    } catch (error) {
      console.error("❌ Error updating package.json:", error.message);
    }
  }
} catch (error) {
  console.log("❌ Vite cannot be run via npx");

  // Try installing vite globally as a last resort
  try {
    console.log("\n📦 Installing vite globally...");
    execSync("npm install -g vite", { stdio: "inherit" });
    console.log("✅ Vite installed globally");
  } catch (error) {
    console.error("❌ Error installing vite globally:", error.message);
  }
}

console.log("\n🧪 Testing if vite works now...");
try {
  execSync("npx --no-install vite --version", { stdio: "inherit" });
  console.log("✅ Success! Vite is now working");
  console.log("\n🚀 You can now run:");
  console.log("npm run dev");
} catch (error) {
  console.error("❌ Vite is still not working:", error.message);
  console.log("\n🔍 Try running these commands manually:");
  console.log("1. npm install vite --save-dev");
  console.log("2. npx vite");
}
