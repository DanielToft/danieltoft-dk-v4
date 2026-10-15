import { mail, type Lang, type PrivacyPolicy } from './privacy-policy';
import { profile } from './profile';

/** The Play Console links to the English page; the two pages link to each other. */
export const privacyPolicyPath = (lang: Lang) => `/apps/hue-switch/${lang}/privacy-policy`;

/** Bump when the policy text changes. */
export const privacyPolicyUpdated = '2026-10-15';

/**
 * Hue Switch talks to the user's own Hue Bridge on the local network and, only with remote access turned
 * on, through Signify's Hue cloud. The bridge key and Hue account tokens are encrypted with a key in the
 * Android Keystore, nothing is in Android backups, the watch never gets the keys, and there is no
 * backend, ads or analytics.
 */
export const privacyPolicy: Record<Lang, PrivacyPolicy> = {
  da: {
    name: 'Dansk',
    title: 'Privatlivspolitik for Hue Switch',
    description: 'Hvilke data Hue Switch gemmer, hvor de sendes hen, og hvad de bruges til.',
    updated: 'Senest opdateret',
    lead: 'Hue Switch sender ingen data til mig. Appen taler direkte med din Hue Bridge på dit eget netværk, og den har ingen reklamer og ingen statistik eller sporing.',
    intro: `Hue Switch er en app til Android-telefoner og Wear OS-ure, der styrer Philips Hue-lys fra widgets, tiles og urskiven. Den er udviklet af ${profile.name} som privatperson. Hue Switch er ikke en app, et produkt eller en tjeneste fra Signify. Philips Hue og Hue er varemærker tilhørende Signify.`,
    sections: [
      {
        heading: 'Data på din telefon',
        blocks: [
          {
            list: [
              { text: 'Din Hue Bridge: navn, ID og adresse på netværket.' },
              {
                text: 'Den adgangsnøgle, bridgen giver appen, når du forbinder. Den gemmes krypteret med en nøgle i Androids Keystore.',
              },
              {
                text: 'Dine lamper, rum, zoner og scener, som bridgen viser dem: navne, og om de er tændt, så widgets og uret kan vise status med det samme.',
              },
              { text: 'Dine favoritter og indstillinger, fx hvilke favoritter hver widget og uret viser.' },
              {
                text: 'Har du slået fjernadgang til: adgangsnøglerne til din Hue-konto. De gemmes også krypteret med en nøgle i Androids Keystore.',
              },
            ],
          },
          {
            p: 'Dataene gemmes kun i appen på din telefon. De kommer ikke med i Androids sikkerhedskopi og flyttes ikke med til en ny telefon. »Glem bridge« under Indstillinger sletter bridgen, adgangsnøglerne, favoritterne og de gemte oplysninger om dit lys fra telefonen og uret. Alt slettes, når du afinstallerer appen eller rydder dens data.',
          },
        ],
      },
      {
        heading: 'Din Hue Bridge',
        blocks: [
          {
            p: 'Appen finder bridgen på dit lokale netværk med mDNS og taler med den over en krypteret forbindelse (HTTPS). Når du forbinder, registrerer bridgen appen under navnet »hueswitch« sammen med din telefons model, fx »Pixel 9«. Registreringen ligger kun på din egen bridge, og »Glem bridge« fjerner den ikke derfra.',
          },
        ],
      },
      {
        heading: 'Fjernadgang',
        blocks: [
          {
            p: 'Fjernadgang er valgfri. Uden den taler appen kun med bridgen på dit eget netværk.',
          },
          {
            p: 'Slår du fjernadgang til, logger du ind på din Hue-konto hos Signify i din browser. Appen får derefter adgangsnøgler til kontoen, og når bridgen ikke kan nås på dit netværk, sender den dine kommandoer og forespørgsler om status gennem Signifys Hue-cloud (api.meethue.com). Det behandles af Signify efter <a href="https://www.philips-hue.com/da-dk/support/legal/privacy-policy">Signifys privatlivspolitik for Philips Hue</a>. »Afbryd« under Fjernadgang sletter nøglerne fra telefonen.',
          },
        ],
      },
      {
        heading: 'Telefon og ur',
        blocks: [
          {
            p: 'Bruger du urappen, sender telefonen dine ur-favoritter og deres status til uret. Uret sender dine tryk tilbage til telefonen, som sender dem videre til bridgen. Uret får aldrig adgangsnøglen til bridgen eller din Hue-konto. Uret gemmer favoritterne og deres status, så tiles kan vises med det samme, og heller ikke de kommer med i sikkerhedskopien.',
          },
          {
            p: 'Overførslen sker kun mellem dine egne parrede enheder og håndteres af Google Play-tjenester (Wear OS Data Layer). Jeg har ikke adgang til dataene. Google Play-tjenester er omfattet af <a href="https://policies.google.com/privacy?hl=da">Googles privatlivspolitik</a>.',
          },
        ],
      },
      {
        heading: 'Tilladelser',
        blocks: [
          {
            list: [
              { term: 'Netværk', text: 'taler med bridgen og, hvis du har slået fjernadgang til, med Hue-cloud.' },
              { term: 'Lokalt netværk', text: 'finder og forbinder til bridgen på dit hjemmenetværk.' },
              { term: 'Multicast', text: 'finder bridgen med mDNS.' },
              {
                term: 'Forgrundstjeneste',
                text: 'holder forbindelsen til bridgen åben, når »Live-opdateringer hjemme« er slået til.',
              },
              { term: 'Start efter genstart', text: 'starter live-opdateringerne igen, når telefonen er blevet genstartet.' },
            ],
          },
        ],
      },
      {
        heading: 'Ændringer',
        blocks: [{ p: 'Ændres politikken, bliver den opdateret på denne side med en ny dato.' }],
      },
      {
        heading: 'Kontakt',
        blocks: [{ p: `Spørgsmål kan sendes til ${mail}.` }],
      },
    ],
  },
  en: {
    name: 'English',
    title: 'Hue Switch Privacy Policy',
    description: 'What data Hue Switch stores, where it is sent and what it is used for.',
    updated: 'Last updated',
    lead: 'Hue Switch sends no data to me. The app talks directly to your Hue Bridge on your own network, and it has no ads and no analytics or tracking.',
    intro: `Hue Switch is an app for Android phones and Wear OS watches that controls Philips Hue lights from widgets, tiles and the watch face. It is developed by ${profile.name} as a private individual. Hue Switch is not a Signify app, product or service. Philips Hue and Hue are trademarks of Signify.`,
    sections: [
      {
        heading: 'Data on your phone',
        blocks: [
          {
            list: [
              { text: 'Your Hue Bridge: its name, ID and network address.' },
              {
                text: 'The access key the bridge gives the app when you connect. It is stored encrypted with a key in the Android Keystore.',
              },
              {
                text: 'Your lights, rooms, zones and scenes as the bridge reports them: names and whether they are on, so widgets and the watch can show their state right away.',
              },
              { text: 'Your favorites and settings, such as which favorites each widget and the watch show.' },
              {
                text: 'If you turn on remote access: the access tokens for your Hue account. They are also stored encrypted with a key in the Android Keystore.',
              },
            ],
          },
          {
            p: 'This data is stored only in the app on your phone. It is excluded from Android backups and is not moved to a new phone. “Forget bridge” in Settings deletes the bridge, the keys, your favorites and the stored information about your lights from the phone and the watch. Everything is deleted when you uninstall the app or clear its data.',
          },
        ],
      },
      {
        heading: 'Your Hue Bridge',
        blocks: [
          {
            p: 'The app finds the bridge on your local network with mDNS and talks to it over an encrypted connection (HTTPS). When you connect, the bridge registers the app under the name “hueswitch” together with your phone’s model, such as “Pixel 9”. The registration is kept only on your own bridge, and “Forget bridge” does not remove it from there.',
          },
        ],
      },
      {
        heading: 'Remote access',
        blocks: [
          {
            p: 'Remote access is optional. Without it, the app only talks to the bridge on your own network.',
          },
          {
            p: 'If you turn on remote access, you log in to your Hue account with Signify in your browser. The app then receives access tokens for the account, and when the bridge cannot be reached on your network, it sends your commands and status requests through Signify’s Hue cloud (api.meethue.com). Signify processes them under <a href="https://www.philips-hue.com/en-gb/support/legal/privacy-policy">Signify’s Philips Hue Privacy Notice</a>. “Disconnect” under Remote access deletes the tokens from the phone.',
          },
        ],
      },
      {
        heading: 'Phone and watch',
        blocks: [
          {
            p: 'If you use the watch app, the phone sends your watch favorites and their state to the watch. The watch sends your taps back to the phone, which passes them on to the bridge. The watch never receives the bridge key or your Hue account tokens. The watch stores the favorites and their state so tiles can show them right away, and these are excluded from backups too.',
          },
          {
            p: 'The transfer happens only between your own paired devices and is handled by Google Play services (Wear OS Data Layer). I have no access to this data. Google Play services is covered by <a href="https://policies.google.com/privacy?hl=en">Google’s Privacy Policy</a>.',
          },
        ],
      },
      {
        heading: 'Permissions',
        blocks: [
          {
            list: [
              { term: 'Network', text: 'talks to the bridge and, if you turned on remote access, to the Hue cloud.' },
              { term: 'Local network', text: 'finds and connects to the bridge on your home network.' },
              { term: 'Multicast', text: 'finds the bridge with mDNS.' },
              {
                term: 'Foreground service',
                text: 'keeps the connection to the bridge open when “Live updates at home” is turned on.',
              },
              { term: 'Run at startup', text: 'restarts live updates after the phone restarts.' },
            ],
          },
        ],
      },
      {
        heading: 'Changes',
        blocks: [{ p: 'If this policy changes, it will be updated on this page with a new date.' }],
      },
      {
        heading: 'Contact',
        blocks: [{ p: `Questions can be sent to ${mail}.` }],
      },
    ],
  },
};
