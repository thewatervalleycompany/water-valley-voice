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

## Add a podcast episode

Episode content is kept in one place: `src/data/episodes.ts`. Add each new
episode to the end of the `episodes` array with its title, Podbean player and
audio links, publication date, duration, guests, teaser, and full description.
The site will then automatically:

- add it to `/episodes/`;
- create its individual episode page;
- feature it as the latest episode on the homepage; and
- include it in the XML sitemap.

Keep slugs in the established format: `episode-2`, `episode-2-part-2`, and so
on. Run `npm run check` and `npm run build` before publishing.

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

## Configure secure studio requests

The studio booking form submits directly to a Cloudflare Pages Function instead
of opening the visitor's email application. Cloudflare Turnstile checks the
request for bots, and the Pages Function passes an approved request to a private
mailer Worker through a service binding. The mailer Worker is not exposed at a
public `workers.dev` URL.

This infrastructure is included in the repository, but it must be connected in
the Cloudflare dashboard before the live form can deliver email. Do not commit
any secret values to GitHub.

### 1. Create the Turnstile widget

1. In Cloudflare, open **Turnstile** and choose **Add widget**.
2. Give the widget a descriptive name such as `Water Valley Voice studio form`,
   add `watervalleyvoice.com` and `www.watervalleyvoice.com` as hostnames, and
   choose the **Managed** widget type.
3. Copy the site key and secret key.
4. Open the `water-valley-voice` Pages project and add these values for both the
   Production and Preview environments:
   - `PUBLIC_TURNSTILE_SITE_KEY`: the public site key, available during the Astro
     build;
   - `TURNSTILE_SECRET_KEY`: the Turnstile secret, saved as an encrypted Pages
     Function secret.

The booking page automatically uses Cloudflare's always-pass Turnstile test key
when it runs through `npm run dev`. That is sufficient for viewing and testing
the browser interface locally. A successful local API submission still needs a
Pages Functions runtime with a local `TURNSTILE_SECRET_KEY` and
`STUDIO_MAILER` service binding; Astro's development server alone does not
provide those server-side bindings.

### 2. Onboard the sending domain

1. In Cloudflare, open **Compute → Email Service** and onboard
   `watervalleyvoice.com` for sending. Add the DNS records Cloudflare requests.
2. Create or approve the sender address that the Worker will use, such as
   `website@watervalleyvoice.com`.
3. Confirm that the `EMAIL` Email Service binding in
   `workers/studio-mailer/wrangler.jsonc` allows that sender address.

Email Routing and Email Service serve different purposes: Email Routing can
forward mail received at `studio@watervalleyvoice.com`, while Email Service is
what lets the private Worker send the form notification.

### 3. Deploy and configure the private mailer Worker

From the project root, authenticate Wrangler with the same Cloudflare account
that owns the domain, then deploy the Worker:

```sh
npx wrangler deploy --config workers/studio-mailer/wrangler.jsonc
```

Open the deployed `water-valley-voice-studio-mailer` Worker in Cloudflare and
add these runtime values under **Settings → Variables and Secrets**:

- `STUDIO_DELIVERY_TO`: the address that should receive studio requests;
- `STUDIO_SENDER`: the approved Email Service sender, for example
  `website@watervalleyvoice.com`.

Treat `STUDIO_DELIVERY_TO` as a secret if it contains a private personal email
address. The Worker configuration keeps `workers_dev` disabled so requests can
reach it only through an authorized Cloudflare binding.

### 4. Bind the Pages Function to the mailer

1. Open the `water-valley-voice` Pages project in Cloudflare.
2. Under **Settings → Bindings**, add a **Service binding**.
3. Set the variable name to `STUDIO_MAILER` and select the
   `water-valley-voice-studio-mailer` Worker as the service.
4. Add the same binding to Preview if studio requests should work on Pages
   preview deployments.
5. Redeploy the Pages project after adding or changing build variables,
   secrets, or bindings.

After deployment, submit one test request from the live booking page and confirm
that it arrives at the chosen destination. The form should display its success
message in the page and should never open a local email application.

### Delivery destination and Cloudflare plan

Choose the destination deliberately before configuration:

- To have Email Service literally address the notification to the routed alias
  `studio@watervalleyvoice.com`, Cloudflare requires the Workers Paid plan,
  currently $5 per month. Set `STUDIO_DELIVERY_TO` to that alias only after the
  paid plan and Email Service sending are enabled.
- On the Workers Free plan, set `STUDIO_DELIVERY_TO` directly to a destination
  address that Cloudflare has verified, such as the personal inbox already used
  by Email Routing. The request reaches the same inbox, but the message is sent
  directly to that verified address rather than literally to the `studio@`
  alias.

Neither option is assumed to be configured by this repository. Verify the
current Cloudflare plan and Email Service limits in the dashboard before making
the form public.

## Help search engines find the website

The production build automatically creates an XML sitemap at
`https://www.watervalleyvoice.com/sitemap-index.xml`. The checked-in
`public/robots.txt` allows crawling and points search engines to that sitemap.
Only submit the production `www` address; it is the site's canonical address.

Do these steps after the latest version is deployed to Cloudflare and both of
the URLs below load in a private browser window:

- `https://www.watervalleyvoice.com/robots.txt`
- `https://www.watervalleyvoice.com/sitemap-index.xml`

### Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console/welcome) and sign in with the Google account that should manage the website.
2. Choose **Add property**, select **Domain**, enter `watervalleyvoice.com` without `https://` or `www`, and choose **Continue**.
3. Google will display a unique DNS TXT verification value. Copy the exact value Google provides; do not use an example or placeholder token.
4. In Cloudflare, open **watervalleyvoice.com → DNS → Records → Add record**. Choose **TXT**, enter `@` for **Name**, paste Google's exact value into **Content**, leave **TTL** set to **Auto**, and save it.
5. Return to Search Console and choose **Verify**. DNS changes may take several minutes to appear. Leave the verification TXT record in Cloudflare after verification succeeds.
6. In the verified property, open **Sitemaps**, enter `sitemap-index.xml` in **Add a new sitemap**, and choose **Submit**.
7. Open **URL inspection**, inspect `https://www.watervalleyvoice.com/`, and choose **Request indexing** if Google says the page is not indexed. Repeat this for important new pages after they are published, including `/episodes/`, `/about/`, `/book-studio/`, and each individual episode URL.
8. Use **Page indexing** to watch for crawl errors and **Performance** to see the searches that bring people to the website. Indexing is controlled by Google and can take time even after a successful request.

### Bing Webmaster Tools

The simplest setup is to import the already verified Google property:

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters/) and sign in.
2. Choose **Import sites from Google Search Console**, then **Continue**.
3. Sign in to the Google account used above, grant Bing read access, select `watervalleyvoice.com`, and choose **Import**.
4. Open the imported site in Bing, go to **Sitemaps**, and confirm that `https://www.watervalleyvoice.com/sitemap-index.xml` appears. If it does not, choose **Submit sitemap** and enter that complete URL.
5. Use **URL Inspection** to check the homepage and each important new page, then choose **Request indexing** when Bing offers it.

If Google import is not available, choose **Add a site** in Bing and follow its
DNS verification option. Bing will generate a unique record value; add that
exact record in **Cloudflare → DNS → Records**, then return to Bing to verify.
Do not commit Google or Bing verification tokens to this repository.

## Forward the contact email through Cloudflare

The website links to `contact@watervalleyvoice.com`. To forward messages sent there to your personal inbox:

1. Make sure `watervalleyvoice.com` uses Cloudflare DNS.
2. In Cloudflare, open **Compute → Email Service → Email Routing** and onboard `watervalleyvoice.com` if prompted.
3. Open **Destination Addresses**, add your personal email address, and click the verification link Cloudflare emails you.
4. Open **Routing Rules** and choose **Create routing rule**.
5. Set the email pattern to `contact`, the action to **Send to an email**, and the destination to your verified personal address.
6. Save the rule, then test it from a different email account by sending a message to `contact@watervalleyvoice.com`.

Cloudflare Email Routing forwards incoming mail. To send outbound messages that appear to come from `contact@watervalleyvoice.com`, you will also need an email/SMTP provider configured for that address.
