import { mail, type Lang, type PrivacyPolicy } from './privacy-policy';
import { profile } from './profile';

/** The Play Console links to the English page; the two pages link to each other. */
export const privacyPolicyPath = (lang: Lang) => `/apps/vejr/${lang}/privacy-policy`;

/** Bump when the policy text changes. */
export const privacyPolicyUpdated = '2026-10-15';

/**
 * Vejr has no account, backend, ads or analytics. While it is open, it sends the shown place's coordinates straight to
 * Open-Meteo, MET Norway, DMI and Photon, and takes coarse location fixes only. Android backups hold the settings
 * (the last shown place, saved places, where the phone was last found and the theme), never the cached data.
 */
export const privacyPolicy: Record<Lang, PrivacyPolicy> = {
  da: {
    name: 'Dansk',
    title: 'Privatlivspolitik for Vejr',
    description: 'Hvilke data Vejr gemmer, hvor de sendes hen, og hvad de bruges til.',
    updated: 'Senest opdateret',
    lead: 'Vejr sender ingen data til mig. Appen har ingen konto, ingen reklamer og ingen statistik eller sporing. For at hente vejret sender den stedets koordinater direkte til de tjenester, prognoserne kommer fra.',
    intro: `Vejr er en app til Android-telefoner, der viser vejrudsigten fra DMI og YR side om side. Den er udviklet af ${profile.name} som privatperson. Vejr er ikke en app fra DMI, Yr, NRK eller MET Norway, og de står ikke bag den.`,
    sections: [
      {
        heading: 'Data på din telefon',
        blocks: [
          {
            list: [
              { text: 'Det sted, du sidst så vejret for, så appen åbner der næste gang.' },
              { text: 'Dine gemte steder: navn, område og koordinater.' },
              { text: 'Hvor din telefon sidst blev fundet: den omtrentlige placering og navnet på stedet.' },
              { text: 'Om appen skal være lys, mørk eller følge telefonen.' },
              {
                text: 'Hentede prognoser, målinger, stationsnavne og søgeresultater, så appen kan vise vejret med det samme og uden internet.',
              },
            ],
          },
          {
            p: 'Har du slået sikkerhedskopi til på telefonen, kommer de fire første med i Androids sikkerhedskopi og flyttes med til en ny telefon, så du beholder dine steder. Sikkerhedskopien ligger i din Google-konto og håndteres af Google. Hentede data kommer ikke med; de hentes igen. Du kan fjerne gemte steder i appen, og alt slettes fra telefonen, når du afinstallerer appen eller rydder dens data.',
          },
        ],
      },
      {
        heading: 'Din placering',
        blocks: [
          {
            p: 'Det er valgfrit at give appen adgang til din placering. Du kan altid søge efter et sted i stedet.',
          },
          {
            p: 'Giver du adgang, bruger appen kun din omtrentlige placering, ikke den præcise. Den finder placeringen, mens appen er åben, fx når du åbner den, og aldrig i baggrunden. Placeringen findes af Google Play-tjenester, som er omfattet af <a href="https://policies.google.com/privacy?hl=da">Googles privatlivspolitik</a>.',
          },
        ],
      },
      {
        heading: 'Vejrtjenester og stednavne',
        blocks: [
          {
            p: 'Appen henter data direkte fra tjenesterne herunder og kun, mens den er åben. Hver tjeneste får koordinaterne for det sted, du ser vejret for, og som ved alle forespørgsler på internettet din IP-adresse. Ser du vejret, hvor du er, er det din omtrentlige placering. Ud over det sender appen kun sit navn og versionsnummer.',
          },
          {
            list: [
              {
                term: 'Open-Meteo',
                text: 'leverer prognosen fra DMI’s HARMONIE-model og havets temperatur og bølger.',
              },
              { term: 'MET Norway', text: 'leverer prognosen, der hedder YR i appen.' },
              {
                term: 'DMI',
                text: 'leverer de seneste målinger fra de nærmeste målestationer og får et område omkring stedet for at finde dem.',
              },
              {
                term: 'Photon',
                text: 'finder steder, når du søger, og navnet på stedet, hvor du er. Når du søger, får Photon det, du skriver, og stedet, du ser vejret for, så de nærmeste steder kommer først.',
              },
            ],
          },
          {
            p: 'Tjenesterne behandler forespørgslerne efter deres egne regler: <a href="https://open-meteo.com/en/terms#privacy">Open-Meteos privatlivspolitik</a>, <a href="https://www.met.no/en/About-us/privacy">MET Norways privatlivspolitik</a>, <a href="https://www.dmi.dk/om-hjemmesiden/privatliv">DMI’s privatlivspolitik</a> og <a href="https://www.komoot.com/privacy">privatlivspolitikken for komoot</a>, der driver Photon. Open-Meteo og MET Norway skriver, at de logger forespørgsler med IP-adresse og koordinater.',
          },
        ],
      },
      {
        heading: 'Tilladelser',
        blocks: [
          {
            list: [
              { term: 'Netværk', text: 'henter prognoser, målinger og stednavne.' },
              {
                term: 'Omtrentlig placering',
                text: 'viser vejret, hvor du er. Den er valgfri, og appen beder hverken om din præcise placering eller om placering i baggrunden.',
              },
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
    title: 'Vejr Privacy Policy',
    description: 'What data Vejr stores, where it is sent and what it is used for.',
    updated: 'Last updated',
    lead: 'Vejr sends no data to me. The app has no account, no ads and no analytics or tracking. To get the weather, it sends the place’s coordinates directly to the services the forecasts come from.',
    intro: `Vejr is an app for Android phones that shows the forecasts from DMI and YR side by side. It is developed by ${profile.name} as a private individual. Vejr is not an app from DMI, Yr, NRK or MET Norway, and they are not behind it.`,
    sections: [
      {
        heading: 'Data on your phone',
        blocks: [
          {
            list: [
              { text: 'The place you last viewed the weather for, so the app opens there next time.' },
              { text: 'Your saved places: name, area and coordinates.' },
              { text: 'Where your phone was last found: the approximate location and the name of the place.' },
              { text: 'Whether the app is light, dark or follows the phone.' },
              {
                text: 'Downloaded forecasts, measurements, station names and search results, so the app can show the weather right away and offline.',
              },
            ],
          },
          {
            p: 'If backup is turned on for your phone, the first four are included in Android backups and moved to a new phone, so you keep your places. The backup is stored in your Google account and handled by Google. Downloaded data is not included; it is downloaded again. You can remove saved places in the app, and everything is deleted from the phone when you uninstall the app or clear its data.',
          },
        ],
      },
      {
        heading: 'Your location',
        blocks: [
          {
            p: 'Giving the app access to your location is optional. You can always search for a place instead.',
          },
          {
            p: 'If you give access, the app uses only your approximate location, not your precise one. It finds your location while the app is open, such as when you open it, and never in the background. The location is found by Google Play services, which is covered by <a href="https://policies.google.com/privacy?hl=en">Google’s Privacy Policy</a>.',
          },
        ],
      },
      {
        heading: 'Weather services and place names',
        blocks: [
          {
            p: 'The app gets data directly from the services below, and only while it is open. Each service receives the coordinates of the place you are viewing the weather for and, as with any request on the internet, your IP address. When you view the weather where you are, that is your approximate location. Apart from that, the app sends only its name and version number.',
          },
          {
            list: [
              {
                term: 'Open-Meteo',
                text: 'provides the forecast from DMI’s HARMONIE model and the sea’s temperature and waves.',
              },
              { term: 'MET Norway', text: 'provides the forecast labelled YR in the app.' },
              {
                term: 'DMI',
                text: 'provides the latest measurements from the nearest weather stations and receives an area around the place to find them.',
              },
              {
                term: 'Photon',
                text: 'finds places when you search and the name of the place where you are. When you search, Photon receives what you type and the place you are viewing the weather for, so the nearest places come first.',
              },
            ],
          },
          {
            p: 'The services process the requests under their own terms: <a href="https://open-meteo.com/en/terms#privacy">Open-Meteo’s privacy policy</a>, <a href="https://www.met.no/en/About-us/privacy">MET Norway’s privacy policy</a>, <a href="https://www.dmi.dk/om-hjemmesiden/privatliv">DMI’s privacy policy</a> (in Danish) and <a href="https://www.komoot.com/privacy">the privacy policy of komoot</a>, which runs Photon. Open-Meteo and MET Norway state that they log requests with the IP address and coordinates.',
          },
        ],
      },
      {
        heading: 'Permissions',
        blocks: [
          {
            list: [
              { term: 'Network', text: 'downloads forecasts, measurements and place names.' },
              {
                term: 'Approximate location',
                text: 'shows the weather where you are. It is optional, and the app asks for neither your precise location nor location in the background.',
              },
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
