import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { nodeFileTrace } from "@vercel/nft";
import rwr from "resolve-workspace-root";
import { globSync } from "tinyglobby";

async function execute(command, options = {}) {
  options.cwd ??= process.cwd();

  const [cmd, ...args] = command.split(" ");
  const child = spawn(cmd, args, { ...options, shell: true });
  const stdout = [];
  const stderr = [];

  return new Promise((resolve, reject) => {
    child.stdout.on(
      "data",
      (data) => !data.includes("npm warn exec") && stdout.push(data.toString()),
    );
    child.stderr.on(
      "data",
      (data) => !data.includes("npm warn exec") && stderr.push(data.toString()),
    );
    child.on("close", (code) =>
      code === 0
        ? resolve(stdout.join(""))
        : reject(new Error(`Command failed: ${command}\n${stderr.join("")}`)),
    );
    child.on("error", reject);
  });
}

if (process.env.VERCEL) {
  console.log("VERCEL CLI Detected!");
  const rootDir = rwr.resolveWorkspaceRoot(process.cwd()) || process.cwd();
  const vercelRootDir = path.join(rootDir, ".vercel");
  const vercelOutputDir = path.join(vercelRootDir, "output");
  const vercelStaticDir = path.join(vercelOutputDir, "static");

  await fs.promises.rm(vercelRootDir, { recursive: true, force: true });
  await fs.promises.mkdir(vercelRootDir, { recursive: true });
  await fs.promises
    .cp(".vercel", vercelRootDir, { force: true, recursive: true })
    .catch(() => {});

  for (const {
    id: bundleId,
    file: serverFile,
    config: { runtime: vercelRuntime },
  } of Object.values({
    index: {
      id: "index",
      file: path.join("dist", "server", "index.js"),
      config: { runtime: "nodejs" },
    },
  })) {
    const bundleDir = path.dirname(path.dirname(serverFile));
    const vercelFuncDir = path.join(
      vercelOutputDir,
      "functions",
      `_${bundleId}.func`,
    );

    const { fileList, esmFileList } = await nodeFileTrace([serverFile], {
      base: process.cwd(),
    });

    const files = [...fileList, ...esmFileList].filter(
      (x) => !x.endsWith("package.json"),
    );
    for (const file of files) {
      const destPath = path.join(vercelFuncDir, file);
      await fs.promises.cp(file, destPath, { force: true, recursive: true });
    }

    await fs.promises
      .cp(path.join("public"), vercelStaticDir, {
        force: true,
        recursive: true,
      })
      .catch(() => {});
    for (const file of globSync(path.join(bundleDir, "client", "**", "*"))) {
      const destPath = path.join(
        vercelStaticDir,
        "client",
        path.basename(file),
      );
      await fs.promises.cp(file, destPath, { force: true, recursive: true });
    }

    await fs.promises.writeFile(
      path.join(vercelFuncDir, ".vc-config.json"),
      JSON.stringify(
        {
          ...(vercelRuntime === "edge"
            ? {
                entrypoint: serverFile,
                runtime: "edge",
              }
            : {
                handler: serverFile,
                runtime: "nodejs22.x",
                launcherType: "Nodejs",
              }),
          supportsResponseStreaming: true,
        },
        null,
        2,
      ),
    );
    await fs.promises.writeFile(
      path.join(vercelOutputDir, "config.json"),
      JSON.stringify(
        {
          version: 3,
          routes: [
            {
              src: "^/_immutable/(.*)$",
              headers: {
                "cache-control": "public, immutable, max-age=31536000",
              },
            },
            { methods: ["GET"], handle: "filesystem" },
            { src: "/(.*)", dest: `_${bundleId}` },
          ],
        },
        null,
        2,
      ),
    );

    const pkg = await fs.promises
      .readFile(path.join("package.json"), "utf8")
      .then(JSON.parse);

    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    const fileUsedDeps = {};
    for (const file of files) {
      const code = await fs.promises.readFile(file);
      for (const dep of Object.keys(deps)) {
        fileUsedDeps[file] ??= [];
        if (code.includes(dep)) {
          fileUsedDeps[file].push(dep);
        }
      }
    }
    const usedDeps = [
      ...new Set(Object.entries(fileUsedDeps).flatMap(([file, deps]) => deps)),
    ];

    await fs.promises.writeFile(
      path.join(vercelFuncDir, "package.json"),
      JSON.stringify(
        {
          type: "commonjs",
          dependencies: usedDeps.reduce((acc, x) => {
            acc[x] = deps[x];
            return acc;
          }, {}),
        },
        null,
        2,
      ),
    );

    await execute(
      "npm install --force --no-frozen-lockfile && npx clean-modules ./node_modules -y",
      {
        cwd: vercelFuncDir,
      },
    );
  }
}
