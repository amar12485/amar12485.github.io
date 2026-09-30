# Amar Portfolio V3

A responsive multi-page HTML/CSS/JavaScript portfolio with a Three.js particle background, mouse-reactive wireframe sphere, glowing custom cursor, tilt cards, functional nav hover, optional audio, project filters, and terminal commands.

## Preview
Open `index.html` in your browser. Internet is needed for the Three.js CDN and Google Fonts; the website content works without them. For a local server, run `python -m http.server 8000` inside this folder and visit http://localhost:8000.

## Customize (no framework or build needed)
1. Open **data.js**. Edit name, tagline, intro, public email, GitHub/Instagram/LinkedIn links, and skills.
2. Add your picture as **assets/profile.jpg**. If absent, initials AK are shown.
3. Optionally put a **public-safe resume** in `assets/` and set `resume: "assets/Amar-Resume.pdf"` in data.js. Remove home address, date of birth, family information and personal phone number if you don't want those public.
4. Add projects by copying an object in `projects` in data.js. Set `status` to Planned, In progress or Completed, and add `demo` and `source` URLs when real.
5. Add screenshots later by extending the project cards in main.js. The current design uses abstract graphic placeholders.

## Files
- `index.html`, `about.html`, `skills.html`, `projects.html`, `experience.html`, `contact.html`
- `style.css`: global styles, nav hover, responsive layouts
- `data.js`: **edit all your content here**
- `main.js`: interactions, filters, terminal, contact mailto
- `three-bg.js`: mouse-reactive sphere and particles
- `assets/`: photo and optional resume

## Important
The contact form uses `mailto:` and **does not send messages automatically**. Configure a real form backend later if needed. Social buttons stay hidden until you enter your real profile URLs. The website does not invent jobs, certifications, skill percentages or completed projects. Optional sound starts OFF. Animations are reduced when the visitor enables reduced-motion preferences.


## V4 updates
- Instagram: https://www.instagram.com/urff_amar/ (@urff_amar), configured centrally in `data.js`.
- Main hero shows **AMAR** only, with animated ice-text depth and mouse-responsive rotation.
- Home skill cards now use stronger 3D perspective and raised elements.
- Crystal-shaped animated desktop cursor (touchscreen and reduced-motion friendly).
- Added typing, computer fundamentals, Word, PowerPoint, Git/GitHub, VS Code, Linux, networking, and data cleaning with honest learning statuses.
- Experience clearly says **Fresher**.

### Add your own photo
Save a square or portrait JPG photo as `assets/profile.jpg` (exact spelling). Refresh `index.html` and the AK placeholder will automatically change to your photo. No personal photo was included in this package. You can change the path in `data.js`.

### Add future projects or skills
Edit the `projects` or `skills` arrays in `data.js`. Each project accepts `title`, `category` (web/games/data/security), `status`, `description`, `tags`, `demo`, `source`. Do not publish private home address, date of birth or family information.
