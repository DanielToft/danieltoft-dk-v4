import { mail, type Lang, type PrivacyPolicy } from './privacy-policy';
import { profile } from './profile';

/** The Play Console links to the English page; the two pages link to each other. */
export const privacyPolicyPath = (lang: Lang) => `/apps/cooking-timer/${lang}/privacy-policy`;

/** Bump when the policy text changes. */
export const privacyPolicyUpdated = '2026-10-15';

/**
 * Cooking Timer stores timers and settings on the device only (no Android backup), syncs them between
 * the user's own phone and watch over the Wear OS Data Layer, and has no account, ads or analytics.
 */
export const privacyPolicy: Record<Lang, PrivacyPolicy> = {
  da: {
    name: 'Dansk',
    title: 'Privatlivspolitik for Cooking Timer',
    description: 'Hvilke data Cooking Timer gemmer, og hvad de bruges til.',
    updated: 'Senest opdateret',
    lead: 'Cooking Timer indsamler ingen personoplysninger. Appen har ingen konto, ingen reklamer og ingen statistik eller sporing, og den sender ingen data til mig eller til andre.',
    intro: `Cooking Timer er en timer-app til Android-telefoner og Wear OS-ure. Den er udviklet af ${profile.name} som privatperson.`,
    sections: [
      {
        heading: 'Data på din enhed',
        blocks: [
          {
            list: [
              { text: 'De timere, du opretter: navn, tid, og om de kører.' },
              { text: 'Dine indstillinger, fx alarmlyd, hvor alarmen skal lyde, og om timerens navn skal læses op.' },
            ],
          },
          {
            p: 'Dataene gemmes kun i appen på din telefon og dit ur. De kommer ikke med i Androids sikkerhedskopi, og de slettes, når du afinstallerer appen eller rydder dens data.',
          },
        ],
      },
      {
        heading: 'Telefon og ur',
        blocks: [
          {
            p: 'Bruger du urappen, sender telefonen dine timere til dit ur, og uret sender dine valg som start, pause og stop tilbage til telefonen. Overførslen sker kun mellem dine egne parrede enheder og håndteres af Google Play-tjenester (Wear OS Data Layer). Jeg har ikke adgang til dataene. Google Play-tjenester er omfattet af <a href="https://policies.google.com/privacy?hl=da">Googles privatlivspolitik</a>.',
          },
        ],
      },
      {
        heading: 'Oplæsning',
        blocks: [
          {
            p: 'Slår du »Læs timerens navn op« til, læses navnet op af den talesyntese, der er installeret på din enhed.',
          },
        ],
      },
      {
        heading: 'Egen alarmlyd',
        blocks: [
          {
            p: 'Vælger du en lyd fra din enhed som alarmlyd, gemmer appen kun en henvisning til lyden. Lydfilen bliver ikke kopieret eller sendt nogen steder hen.',
          },
        ],
      },
      {
        heading: 'Tilladelser',
        blocks: [
          {
            list: [
              { term: 'Notifikationer', text: 'viser timere, nedtælling i statuslinjen og alarmer.' },
              { term: 'Præcise alarmer', text: 'får alarmen til at lyde på sekundet.' },
              { term: 'Fuldskærmsnotifikationer', text: 'viser alarmen, når skærmen er låst.' },
              {
                term: 'Forgrundstjeneste, vibration og vækning',
                text: 'afspiller alarmen og vibrerer, også når skærmen er slukket.',
              },
              { term: 'Start efter genstart', text: 'planlægger alarmerne igen, når enheden er blevet genstartet.' },
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
    title: 'Cooking Timer Privacy Policy',
    description: 'What data Cooking Timer stores and what it is used for.',
    updated: 'Last updated',
    lead: 'Cooking Timer does not collect any personal data. The app has no account, no ads and no analytics or tracking, and it sends no data to me or to anyone else.',
    intro: `Cooking Timer is a timer app for Android phones and Wear OS watches. It is developed by ${profile.name} as a private individual.`,
    sections: [
      {
        heading: 'Data on your device',
        blocks: [
          {
            list: [
              { text: 'The timers you create: name, duration and whether they are running.' },
              { text: 'Your settings, such as the alarm sound, where the alarm rings and whether the timer name is read aloud.' },
            ],
          },
          {
            p: 'This data is stored only in the app on your phone and watch. It is excluded from Android backups and is deleted when you uninstall the app or clear its data.',
          },
        ],
      },
      {
        heading: 'Phone and watch',
        blocks: [
          {
            p: 'If you use the watch app, the phone sends your timers to your watch, and the watch sends your actions such as start, pause and stop back to the phone. The transfer happens only between your own paired devices and is handled by Google Play services (Wear OS Data Layer). I have no access to this data. Google Play services is covered by <a href="https://policies.google.com/privacy?hl=en">Google’s Privacy Policy</a>.',
          },
        ],
      },
      {
        heading: 'Reading names aloud',
        blocks: [
          {
            p: 'If you turn on “Read the timer name aloud”, the name is spoken by the text-to-speech engine installed on your device.',
          },
        ],
      },
      {
        heading: 'Custom alarm sound',
        blocks: [
          {
            p: 'If you choose a sound from your device as the alarm sound, the app stores only a reference to it. The sound file is not copied or sent anywhere.',
          },
        ],
      },
      {
        heading: 'Permissions',
        blocks: [
          {
            list: [
              { term: 'Notifications', text: 'show timers, the countdown in the status bar and alarms.' },
              { term: 'Exact alarms', text: 'make the alarm ring on the second.' },
              { term: 'Full-screen notifications', text: 'show the alarm when the screen is locked.' },
              {
                term: 'Foreground service, vibration and wake lock',
                text: 'play the alarm and vibrate, also when the screen is off.',
              },
              { term: 'Run at startup', text: 'reschedule alarms after the device restarts.' },
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
