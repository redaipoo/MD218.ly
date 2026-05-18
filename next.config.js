/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS || false;

let repo = '';
if (isGithubActions) {
  // Extract repository name from GITHUB_REPOSITORY (e.g., "redaipoo/MD.LY")
  const repoName = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  repo = `/${repoName}`;
}

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: repo,
  assetPrefix: repo,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: repo,
  }
};

module.exports = nextConfig;
