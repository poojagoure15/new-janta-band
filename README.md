# New Janta Band - Static Website

This is a simple static website for New Janta Band, built with HTML, CSS (Tailwind via CDN), and JavaScript.

## Deployment

### 1. GitHub Pages (Static Hosting)

1.  **Create a new repository** on GitHub.
2.  **Push these files** to your repository:
    *   `index.html`
    *   `style.css`
    *   `script.js`
3.  Go to your repository **Settings** -> **Pages**.
4.  Under **Source**, select `main` (or `master`) branch and `/` (root) folder.
5.  Click **Save**.

Your website will be live at `https://<your-username>.github.io/<repository-name>/`.

### 2. AI Studio / Local Development (Node.js)

This project includes a `package.json` file to run a local development server, making it compatible with AI Studio and other Node.js environments.

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start the server**:
    ```bash
    npm run dev
    ```
3.  Open `http://localhost:3000` in your browser.

## Features

*   Responsive Design
*   Hero Image Carousel
*   Booking & Inquiry Forms (WhatsApp Integration)
*   Package Selection
*   Testimonials Section
*   YouTube Video Integration
