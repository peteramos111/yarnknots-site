/*
  Yarn Knots website settings.
  Fill these in after signing up for each service (see README.md). Until they're filled in,
  forms show a friendly "not connected yet" message and nothing is sent anywhere.
  (Email signups are handled by the Sender.net form embedded in the pages, so they aren't set here.)
*/
window.YK_CONFIG = {
  // Formspree: your form's endpoint. Looks like: https://formspree.io/f/abcdwxyz
  formspreeUrl: "https://formspree.io/f/mvkzvpgy",

  // GoatCounter: your site code (the part before .goatcounter.com). Example: "yarnknots"
  goatcounterCode: "yarnknots",

  // Social profiles. Remove any you don't use.
  socials: {
    tiktok: "https://www.tiktok.com/@yarnknots",
    instagram: "https://www.instagram.com/yarnknots",
    youtube: "https://www.youtube.com/@yarnknots",
    facebook: "https://www.facebook.com/yarnknots"
  },

  contactEmail: "hello@yarnknots.com"
};

// Events sent before the stats script has loaded wait in this queue and are sent once it's ready.
window.ykQueue = window.ykQueue || [];
window.ykEvent = window.ykEvent || function (name) { window.ykQueue.push(name); };
