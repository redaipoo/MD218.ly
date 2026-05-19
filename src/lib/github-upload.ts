/**
 * Upload a file (image) to GitHub repo via the Contents API.
 * Returns the public path (relative to /public) on success.
 */

const OWNER = "redaipoo";
const REPO = "MD218.ly";
const BRANCH = "main";

export async function uploadImageToGitHub(
  file: File,
  destPath: string, // e.g. "public/images/products/my-card.jpg"
  token: string,
  commitMessage = "Upload image via Admin"
): Promise<string> {
  // Convert file to base64
  const base64 = await fileToBase64(file);

  // Check if file already exists (to get SHA for update)
  let sha: string | undefined;
  try {
    const getRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${destPath}?ref=${BRANCH}&t=${Date.now()}`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );
    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    }
  } catch {
    // File doesn't exist, that's fine
  }

  // Upload / update
  const body: Record<string, string> = {
    message: commitMessage,
    content: base64,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const putRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${destPath}`,
    {
      method: "PUT",
      headers: {
        Authorization: `token ${token}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!putRes.ok) {
    const err = await putRes.text();
    throw new Error(`Failed to upload image: ${err}`);
  }

  // Return the public-relative path
  // e.g. "public/images/products/my-card.jpg" -> "/images/products/my-card.jpg"
  return "/" + destPath.replace(/^public\//, "");
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the "data:image/...;base64," prefix
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
