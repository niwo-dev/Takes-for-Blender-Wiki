# Deploying the Wiki

This guide explains how to publish the Takes for Blender documentation to your web server.

## How It Works

```
Push to main → GitHub Action builds HTML → SFTP uploads to your server
```

Every push that changes `docs/` or `mkdocs.yml` triggers an automatic rebuild and upload.

## One-Time Setup

### 1. Add FTP Credentials to GitHub

Go to your repository on GitHub:

1. Click **Settings** → **Secrets and variables** → **Actions**.
2. Click **New repository secret** and add these four secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `FTP_HOST` | Your server hostname | `ftp.yourdomain.com` |
| `FTP_USER` | FTP username | `wiki@yourdomain.com` |
| `FTP_PASS` | FTP password | `your-password` |
| `FTP_TARGET_DIR` | Server directory path | `/www/docs/` |

!!! warning "Trailing Slash"
    The `FTP_TARGET_DIR` **must** end with a `/` (e.g., `/www/docs/`).

### 2. Create the Target Directory

On your web server, create the directory where the wiki will live.
For example, if your wiki should be at `yourdomain.com/docs/`:

- Create `/www/docs/` (or whatever your hoster's web root path is)
- Make sure the FTP user has write access to this directory

### 3. Update the Site URL

Edit `mkdocs.yml` and set `site_url` to your actual URL:

```yaml
site_url: https://yourdomain.com/docs/
```

### 4. Push

Commit and push. The GitHub Action will build and upload automatically.

## Preview Locally

Before pushing, preview the site locally:

```powershell
python -m mkdocs serve
```

Opens at `http://127.0.0.1:8000/` with live reload.

## Manual Deployment

To deploy without pushing to GitHub:

```powershell
python -m mkdocs build --strict
```

Then upload the `site/` folder to your server via your FTP client.

## Troubleshooting

??? question "The Action failed with a connection error"
    - Verify `FTP_HOST`, `FTP_USER`, and `FTP_PASS` are correct in GitHub Secrets.
    - Check that your hoster allows FTPS connections (port 21 with TLS).
    - Some hosters require you to whitelist GitHub's IP ranges.

??? question "The site is uploaded but shows a blank page"
    - Check that `FTP_TARGET_DIR` points to the correct web root.
    - Verify `site_url` in `mkdocs.yml` matches your actual domain path.
    - Check file permissions on the server (files should be readable).

??? question "Changes aren't showing up after push"
    - Hard-refresh the page (++ctrl+shift+r++) to bypass browser cache.
    - Check the **Actions** tab on GitHub to confirm the workflow ran.
    - Verify all changes are on the `main` branch.
