# Water Valley Voice website

A responsive Astro website for [watervalleyvoice.com](https://www.watervalleyvoice.com), with the latest Podbean episode, podcast RSS feed, YouTube playlist, and social links.

## Preview locally

1. Open Terminal and move into this project:
   ```sh
   cd "/Users/erichards/Websites/Water Valley Voice"
   ```
2. Install the site packages (needed the first time only):
   ```sh
   npm install
   ```
3. Start the local preview:
   ```sh
   npm run dev
   ```
4. Open the local address shown in Terminal, normally `http://localhost:4321`.
5. Press `Control+C` in Terminal when you are finished.

To preview the exact production build, run `npm run build`, then `npm run preview`.

## Add photographs and other media

Place website photographs in `public/media/images/`. The starter folders also include `audio/` and `video/`, but full podcast episodes should remain on Podbean and long videos should remain on YouTube.

Files under `public/` are referenced from the site without the word `public`. For example:

```astro
<img src="/media/images/your-photo.jpg" alt="Describe the photo" />
```

## Publish with Cloudflare Pages

### Recommended: connect a GitHub repository

1. Sign in to [GitHub](https://github.com), select the **+** menu in the upper-right corner, and choose **New repository**. You can also go directly to [github.com/new](https://github.com/new).
2. Name it `water-valley-voice` and add an optional description such as “Official Water Valley Voice podcast website.”
3. Choose **Private** if only invited collaborators should see the source, or **Public** if anyone may see it. Either visibility works with Cloudflare Pages.
4. Because this folder already has a README and `.gitignore`, leave **Add a README**, **Add .gitignore**, and **Choose a license** turned off. Select **Create repository**.
5. Back in Terminal, move into this project and run the commands below. Replace `YOUR-GITHUB-USERNAME` with your GitHub username:
   ```sh
   cd "/Users/erichards/Websites/Water Valley Voice"
   git init
   git add .
   git commit -m "Create Water Valley Voice website"
   git branch -M main
   git remote add origin https://github.com/YOUR-GITHUB-USERNAME/water-valley-voice.git
   git push -u origin main
   ```
6. If GitHub asks you to sign in, follow the authentication prompt. GitHub no longer accepts a normal account password for command-line pushes.
7. Confirm the website files appear on the repository page.

Now connect that repository to Cloudflare:

1. Sign in to Cloudflare and open **Workers & Pages**.
2. Choose **Create application**, then **Pages**, then **Import an existing Git repository**.
3. Connect GitHub and select the repository.
4. Use these build settings:
   - Production branch: `main`
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Choose **Save and Deploy**. Cloudflare will provide a temporary `pages.dev` address.
6. In the Pages project, open **Custom domains**, choose **Set up a custom domain**, and enter `www.watervalleyvoice.com`.
7. If `watervalleyvoice.com` already uses Cloudflare DNS, Cloudflare can add the required DNS record. If the domain uses another DNS provider, follow the CNAME instructions Cloudflare displays.
8. Add the root domain `watervalleyvoice.com` as a second custom domain if you want it to work without `www`. Configure it to redirect to `www.watervalleyvoice.com` so search engines see one canonical address.

Every future push to `main` will automatically rebuild and publish the website. Pull requests can receive separate preview addresses before they go live.

## Forward the contact email through Cloudflare

The website links to `contact@watervalleyvoice.com`. To forward messages sent there to your personal inbox:

1. Make sure `watervalleyvoice.com` uses Cloudflare DNS.
2. In Cloudflare, open **Compute → Email Service → Email Routing** and onboard `watervalleyvoice.com` if prompted.
3. Open **Destination Addresses**, add your personal email address, and click the verification link Cloudflare emails you.
4. Open **Routing Rules** and choose **Create routing rule**.
5. Set the email pattern to `contact`, the action to **Send to an email**, and the destination to your verified personal address.
6. Save the rule, then test it from a different email account by sending a message to `contact@watervalleyvoice.com`.

Cloudflare Email Routing forwards incoming mail. To send outbound messages that appear to come from `contact@watervalleyvoice.com`, you will also need an email/SMTP provider configured for that address.
