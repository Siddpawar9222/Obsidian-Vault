

### How to Deploy a React Project to GitHub Pages

1. **Connect Git and GitHub:**
    
    - Make sure your project is connected to a GitHub repository. Push your code to GitHub.
2. **Install the `gh-pages` package:**  
    Run the following command in your project folder:
    
    ```bash
    npm install gh-pages --save-dev
    ```
    
3. **Update `package.json`:**
    
    - Add the following scripts inside the `"scripts"` section:
        
        ```json
        "predeploy": "npm run build",
        "deploy": "gh-pages -d build"
        ```
        
    - Add a `homepage` field at the top of your `package.json`:
        
        ```json
        "homepage": "https://<your-github-username>.github.io/<your-project-name>/"
        ```
        
        Replace `<your-github-username>` with your GitHub username and `<your-project-name>` with your repository name.
4. **Deploy your project:**  
    Run the following command to deploy your project:
    
    ```bash
    npm run deploy
    ```
    
5. **Set up GitHub Pages:**
    
    - Go to your GitHub repository.
    - Navigate to **Settings** > **Pages**.
    - Select the `gh-pages` branch and save.
6. **Static Websites (without React Router):**  
    If your React project doesn't use React Router, it should work without issues.
    
7. **Fixing the 404 Error (for projects with React Router):**  
    If your project uses React Router, you might see a 404 error when navigating. To fix this, you'll need additional configuration, like adding a `redirects` file or using HashRouter. Refer to the links below for detailed instructions.
    
8. **Helpful Resources:**
    
    - [FreeCodeCamp Guide](https://www.freecodecamp.org/news/deploy-a-react-app-to-github-pages/)
    - [GitHub Community Discussion](https://github.com/community/community/discussions/22392#discussioncomment-10697248)
    
9. **If You add custom domain then**
     -  Add CNAME file in public folder and with new domain URL
     - Change  
         ```json
        "homepage": "https://<your-github-username>.github.io/<your-project-name>/"
        ```
          to 
      ```json
         "homepage": "https://<your-github-username>.github.io/"
```

     - [GitHub Community Discussion](https://github.com/orgs/community/discussions/23066#discussioncomment-3238923)

 ---
    If you want normal url (without hashing) follow following blog
      [Medium Blog](https://medium.com/@itspaulolimahimself/deploying-a-react-js-spa-app-to-github-pages-58ddaa2897a3)
      [GitHub Repo](https://github.com/rafgraph/spa-github-pages)

---
 CI-CD  with react and gh-pages: 

- create different environments
- Create build of that environment
- create 404 file similar to index.html and put in build
- copy domain name for environment to CNAME and CNAME to build folder
- Need to define CNAME mapping in bigrock (example : when we host build to react app it create url like `https://techeazy-consulting.github.io/techeazy-frontend` this url we need to define in  bigrock CNAME)
- To Host on self repo gh-pages need to give following 
- ![[Pasted image 20250703115928.png]]
- ![[Pasted image 20250703120015.png]]

  if you want deploy on another repository branch(gh-pages) then
  ![[Pasted image 20250703120238.png]]
Create token(classic token) with _repo, workflow_ permissions

Write deploy.yml carefully