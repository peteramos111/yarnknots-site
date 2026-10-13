# yarnknots.com

The Yarn Knots website: home page, free playable demo (levels 1–10 + Daily Tangle), privacy policy, terms of use, contact form, press kit and a "page not found" page. Plain HTML, CSS and JavaScript: no build step.

This repository is **public** (required for free GitHub Pages). It contains only the website and demo; keep the main game project in a separate private repository.

## 1. Put the site on GitHub Pages

1. On github.com, create a new repository named `yarnknots-site` (any name works). Set it to **Public**. Don't add a README.
2. Open the repository, choose **Add file → Upload files**, and drag in **everything inside this folder** (including the hidden `.nojekyll` file if your computer shows it; it's optional). Click **Commit changes**.
3. Go to **Settings → Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch **main**, folder **/ (root)**, and **Save**.
4. Still on the Pages screen, in **Custom domain** enter `yarnknots.com` and **Save**. (The `CNAME` file in this folder already says yarnknots.com.)

## 2. Point yarnknots.com at GitHub

At the company where you bought the domain, open its **DNS settings** and add these records (delete any existing "parked" A records for `@` first):

| Type | Host / Name | Value |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | YOUR-GITHUB-USERNAME.github.io |

Don't change the MX records that make hello@yarnknots.com work.

DNS can take from a few minutes to 24 hours. When GitHub's Pages screen shows the domain check passed, tick **Enforce HTTPS**. (Optional but recommended: verify the domain under your GitHub profile **Settings → Pages → Add a domain**, so nobody else can claim it.)

GitHub's own guide, in case anything differs: docs.github.com → "Managing a custom domain for your GitHub Pages site".

## 3. Connect the forms and stats

All settings live in **`assets/config.js`**. Edit it on GitHub (open the file, click the pencil icon, paste, **Commit changes**).

**Launch email signups: MailerLite (free up to 250 subscribers)**
1. Sign up at mailerlite.com with hello@yarnknots.com.
2. Create a subscriber group called "Launch list", then **Forms → Embedded forms → Create**, connect it to that group, and keep just the email field.
3. Open the form's **HTML code** and find `action="https://assets.mailerlite.com/jsonp/.../subscribe"`. Copy that URL into `mailerliteFormUrl`.
4. Test: sign up on yarnknots.com with your own address and check it appears in MailerLite.

**Contact form: Formspree (free, 50 messages a month)**
1. Sign up at formspree.io with hello@yarnknots.com and create a new form.
2. Copy its endpoint (looks like `https://formspree.io/f/abcdwxyz`) into `formspreeUrl`.
3. In the form's settings, restrict submissions to the domain `yarnknots.com`.

**Visitor stats: GoatCounter (free, no cookies)**
1. Sign up at goatcounter.com. Choose the code `yarnknots` (giving yarnknots.goatcounter.com).
2. Put that code in `goatcounterCode`.
3. Besides page views, the demo reports these events, which are what the ad test measures:
   `demo-first-visit`, `demo-start-level-N`, `demo-complete-level-N`, `demo-help-free`, `demo-help-yarn`, `demo-daily-complete`, `demo-finished`, `signup-home`, `signup-demo-end`, `contact-sent`.

**Socials:** the links in `config.js` assume the handle @yarnknots everywhere. Change any that differ, or delete a line to hide that icon.

## 4. Fill in the legal placeholders

Search the site for text highlighted in yellow (`class="placeholder"`):

- `privacy/index.html`: your legal name or company, and your city/province or state/country
- `terms/index.html`: the same, plus the province/state whose laws apply
- `press/index.html`: studio or developer name and location

Have a lawyer review the privacy policy and terms before running paid ads.

## Links for the ad test

- Demo: https://yarnknots.com/play/
- Add tracking tags per video so GoatCounter shows which ad sent each visitor, e.g.
  `https://yarnknots.com/play/?utm_source=tiktok&utm_campaign=mischief`

## Updating the demo later

`play/index.html` is the whole game in one file. To update it, replace that file. Levels beyond 10 show a "You finished the demo!" screen with the email signup; the limit is `DEMO_MAX` near the middle of the file.
