import { mkdir, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const DOCS = [
  {
    slug: "cli",
    title: "CLI Quickstart",
    description: "Install and run the d0s CLI to bootstrap secure clusters.",
    remote: "docs/cli.md",
  },
  {
    slug: "catalog",
    title: "Catalog Consumption",
    description: "How to source, verify, and deploy packages from the d0s catalog.",
    remote: "docs/catalog.md",
  },
];

const DEFAULT_REMOTE_BASE = "https://raw.githubusercontent.com/d0s-dev/docs/refs/heads/main";
const remoteBase = process.env.D0S_DOCS_REMOTE_BASE ?? DEFAULT_REMOTE_BASE;

async function ensureDir(path) {
  try {
    await mkdir(path, { recursive: true });
  } catch (error) {
    if ((error?.code ?? "") !== "EEXIST") {
      throw error;
    }
  }
}

async function fetchRemote(path) {
  const url = `${remoteBase.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "d0s-astro-sync-docs",
      Accept: "text/plain",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function writeDoc({ slug, title, description, remote }) {
  const targetPath = join("src", "content", "docs", "docs", `${slug}.mdx`);
  const targetDir = dirname(targetPath);
  await ensureDir(targetDir);

  let remoteBody = "";
  try {
    remoteBody = await fetchRemote(remote);
  } catch (error) {
    console.warn(`⚠️  Skipping remote sync for ${slug}: ${error.message}`);
    return;
  }

  const frontmatter = `---\ntitle: "${title}"\ndescription: "${description}"\nsidebar:\n  label: "${title}"\n---`;
  const banner = `\n\nimport VersionSwitcher from "../../../components/docs/VersionSwitcher.astro";\n\n<VersionSwitcher alignment="left" />\n\n`;
  const content = `${frontmatter}${banner}${remoteBody.trim()}\n`;

  await writeFile(targetPath, content, "utf8");
  console.log(`✅ Synced remote doc ${slug}`);
}

async function main() {
  const projectRoot = new URL("..", import.meta.url).pathname;
  try {
    const stats = await stat(projectRoot);
    if (!stats.isDirectory()) {
      throw new Error("Invalid project root");
    }
  } catch (error) {
    console.warn(`⚠️  Unable to verify workspace: ${error.message}`);
  }

  await Promise.all(DOCS.map((doc) => writeDoc(doc)));
}

main().catch((error) => {
  console.warn(`⚠️  Remote documentation sync failed: ${error.message}`);
  process.exit(0);
});
