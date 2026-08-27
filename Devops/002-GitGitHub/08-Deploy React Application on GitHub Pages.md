
---

## Basic Deployment Steps

1. **Connect Git and GitHub**
   - Make sure your project is connected to a GitHub repository and push your code to GitHub.

2. **Install the `gh-pages` package**

   ```bash
   npm install gh-pages --save-dev
   ```

3. **Update `package.json`**

   - Add a `homepage` field at the top:

     ```json
     "homepage": "https://<your-github-username>.github.io/<your-project-name>/"
     ```

   - Add the following inside the `"scripts"` section:

     ```json
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
     ```

4. **Deploy your project**

   ```bash
   npm run deploy
   ```

5. **Set up GitHub Pages**
   - Go to your GitHub repository
   - Navigate to **Settings** → **Pages**
   - Select the `gh-pages` branch and save

6. **Static Websites (without React Router)**
   If your React project doesn't use React Router, it should work without issues.

7. **Fixing the 404 Error (for projects with React Router)**
   If your project uses React Router, you might see a 404 error when navigating directly to a URL. To fix this:
   - Use `HashRouter` instead of `BrowserRouter`
   - Or follow the [spa-github-pages guide](https://github.com/rafgraph/spa-github-pages)
   - [Medium Blog](https://medium.com/@itspaulolimahimself/deploying-a-react-js-spa-app-to-github-pages-58ddaa2897a3)

8. **Helpful Resources**
   - [FreeCodeCamp Guide](https://www.freecodecamp.org/news/deploy-a-react-app-to-github-pages/)
   - [GitHub Community Discussion](https://github.com/community/community/discussions/22392#discussioncomment-10697248)

---

## Custom Domain Setup

1. Add a `CNAME` file in the `public/` folder containing your custom domain URL.

2. Update `homepage` in `package.json` from:

   ```json
   "homepage": "https://<your-github-username>.github.io/<your-project-name>/"
   ```

   to:

   ```json
   "homepage": "https://<your-custom-domain>/"
   ```

3. Define the CNAME mapping in your DNS provider (e.g., Bigrock).

- [GitHub Community Discussion on custom domains](https://github.com/orgs/community/discussions/23066#discussioncomment-3238923)

---

## CI/CD with GitHub Actions + gh-pages

Steps to automate deployment:

- Create different environments (dev, staging, prod)
- Create a build for each environment
- Create a `404.html` file (copy of `index.html`) and place it in the build folder
- Copy the domain name for the environment into a `CNAME` file and include it in the build folder
- Define CNAME mapping in your DNS provider
  - Example: `https://techeazy-consulting.github.io/techeazy-frontend` → map this in Bigrock CNAME
- Create a classic **Personal Access Token** with `repo` and `workflow` permissions
- Write a `deploy.yml` GitHub Actions workflow carefully

> **Note:** If deploying to another repository's `gh-pages` branch, the token and workflow permissions need to be configured accordingly.