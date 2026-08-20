/**
 * github-cms.js
 * Shared data service — GitHub API as CMS backend.
 * Replaces the PHP api.php entirely.
 *
 * READ  → raw.githubusercontent.com (public, no token, no rate limit)
 * WRITE → GitHub REST API v3 (requires Personal Access Token)
 * IMAGE → Imgbb API (free image hosting, no PHP needed)
 */

const GITHUB_USER = 'robbyhdayatt';
const GITHUB_REPO = 'byron-portfolio';
const CONTENT_PATH = 'public/admin/content.json';
const GITHUB_BRANCH = 'main';

const RAW_URL = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${CONTENT_PATH}`;
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${CONTENT_PATH}`;

// ─────────────────────────────────────────────────────────────
// READ — No token needed (public repo)
// ─────────────────────────────────────────────────────────────

let _cachedContent = null;

/**
 * Fetch content.json from GitHub.
 * If token is provided, fetches directly from GitHub Contents API (0s cache).
 * Otherwise fetches from GitHub Raw URL with cache-busting.
 * Falls back to null on failure (caller handles static fallback).
 * @param {string|null} token
 * @returns {Promise<object|null>}
 */
export async function fetchContent(token = null) {
  if (_cachedContent && !token) return _cachedContent;

  const headers = {
    Accept: 'application/vnd.github+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // 1. Primary: Fetch directly from GitHub REST Contents API (0s cache delay, always 100% instant fresh)
  try {
    const res = await fetch(`${API_URL}?t=${Date.now()}`, {
      headers,
      cache: 'no-store',
    });
    if (res.ok) {
      const fileInfo = await res.json();
      if (fileInfo.content) {
        const decoded = _fromBase64(fileInfo.content);
        _cachedContent = JSON.parse(decoded);
        return _cachedContent;
      }
    }
  } catch (err) {
    console.warn('[github-cms] Direct API fetch failed, trying fallback.', err);
  }

  // 2. Fallback: GitHub Raw URL (if unauthenticated rate limit reached)
  try {
    const res = await fetch(`${RAW_URL}?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      _cachedContent = await res.json();
      return _cachedContent;
    }
  } catch (e) {
    console.warn('[github-cms] Raw fetch failed, trying local fallback.', e);
  }

  // 3. Fallback: Local ./admin/content.json
  try {
    const res = await fetch(`./admin/content.json?t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (res.ok) {
      _cachedContent = await res.json();
      return _cachedContent;
    }
  } catch (e) {
    // Ignore fallback
  }

  return null;
}

/**
 * Invalidate the in-memory cache (call after saving).
 */
export function invalidateCache() {
  _cachedContent = null;
}

// ─────────────────────────────────────────────────────────────
// WRITE — Requires GitHub Personal Access Token
// ─────────────────────────────────────────────────────────────

/**
 * Save data to content.json via GitHub API.
 * Each call creates a new Git commit automatically.
 * @param {object} data   - Full content object to save
 * @param {string} token  - GitHub Personal Access Token
 * @returns {Promise<void>}
 */
export async function saveContent(data, token) {
  // Step 1: Get current file SHA (required by GitHub API for updates)
  const fileRes = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!fileRes.ok) {
    const err = await fileRes.json().catch(() => ({}));
    throw new Error(err.message || `GitHub API error: ${fileRes.status}`);
  }

  const fileInfo = await fileRes.json();

  // Step 2: Encode JSON as Base64 (GitHub API requirement)
  const jsonString = JSON.stringify(data, null, 2);
  const encoded = _toBase64(jsonString);

  // Step 3: PUT updated content
  const putRes = await fetch(API_URL, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'chore: update portfolio content via CMS',
      content: encoded,
      sha: fileInfo.sha,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!putRes.ok) {
    const err = await putRes.json().catch(() => ({}));
    throw new Error(err.message || `Failed to save: ${putRes.status}`);
  }

  // Invalidate cache so next fetch gets fresh data
  invalidateCache();
}

// ─────────────────────────────────────────────────────────────
// UPLOAD IMAGE — Directly to GitHub Repository
// ─────────────────────────────────────────────────────────────

/**
 * Upload an image file directly to the GitHub repository via GitHub API.
 * Committed to public/assets/images/ in the repo.
 * @param {File}   file   - Image file from <input type="file">
 * @param {string} token  - GitHub Personal Access Token
 * @returns {Promise<string>} - Permanent public image URL
 */
export async function uploadImage(file, token) {
  if (!token) throw new Error('GitHub Token tidak ditemukan.');

  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Ukuran gambar terlalu besar (maksimum 5 MB).');
  }

  // Convert file to base64
  const base64Data = await _fileToBase64(file);

  // Generate safe filename
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const safeName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
  const filename = `img_${Date.now()}_${safeName}.${ext}`;
  const targetRepoPath = `public/assets/images/${filename}`;
  const uploadApiUrl = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${targetRepoPath}`;

  const res = await fetch(uploadApiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `feat(assets): upload image ${filename} via CMS`,
      content: base64Data,
      branch: GITHUB_BRANCH,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Upload ke GitHub gagal: ${res.status}`);
  }

  // Return public GitHub Raw URL (accessible immediately globally)
  return `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${targetRepoPath}`;
}

// ─────────────────────────────────────────────────────────────
// VERIFY TOKEN — Check if GitHub token is valid
// ─────────────────────────────────────────────────────────────

/**
 * Verify that a GitHub token has access to the repo.
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export async function verifyToken(token) {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
        },
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

// ─────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────

/**
 * Safely encode a Unicode string to Base64.
 * Native btoa() fails on non-Latin characters (e.g. Indonesian text).
 */
function _toBase64(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );
}

/**
 * Safely decode Base64 string from GitHub API to Unicode string.
 */
function _fromBase64(str) {
  const cleaned = str.replace(/\s/g, '');
  return decodeURIComponent(
    atob(cleaned)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

/**
 * Convert a File or Blob object to raw Base64 string.
 */
function _fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}


