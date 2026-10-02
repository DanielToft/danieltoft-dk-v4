export const profile = {
  name: 'Daniel Toft',
  title: 'Software, Cloud & Platform Architect',
  city: 'Aarhus',
  /** The root of the log: `Initial commit`. */
  born: '1989-08-20',
  email: 'mail@danieltoft.dk',
  github: { handle: 'DanielToft', url: 'https://github.com/DanielToft' },
  /** This site's own repository: `git blame` links the line it proves to the commit that built the page. */
  source: 'https://github.com/DanielToft/danieltoft-dk-v4',
  linkedin: { handle: 'danieltoft89', url: 'https://www.linkedin.com/in/danieltoft89' },
  lead: 'Softwarearkitekt & udvikler i Aarhus.',
  /**
   * about.md: one array per paragraph, one line per clause (semantic line breaks). `since` is the month a line
   * became true: `git blame` puts it on the role from then, and a checkout from before fades it. A line with
   * `proof` is proven by the site itself: blamed on the performance test in this repo, its last scores under it.
   */
  about: [
    [
      { text: 'Jeg har arbejdet med software siden 2008,', since: '2008-05' },
      { text: 'fra lærling hos Bang & Olufsen', since: '2008-05' },
      { text: 'til Software, Cloud & Platform Architect hos ILLUMI.', since: '2016-06' },
      { text: 'Jeg har arbejdet med C# og .NET på Microsoft-platformen fra starten', since: '2008-05' },
      { text: 'og har gennem årene beskæftiget mig bredt med både frontend, backend og cloud.', since: '2016-06' },
    ],
    [
      { text: 'Mit primære fokus er softwaredesign og arkitektur,', since: '2016-06' },
      { text: 'hele vejen fra kode og applikationsarkitektur til den platform, løsningen kører på.', since: '2016-06' },
      { text: 'Jeg går især op i performance,', since: '2016-06', proof: true },
      { text: 'sikkerhed og robuste løsninger', since: '2010-04' },
      { text: 'og har stor erfaring med cloud-teknologi, primært Microsoft Azure.', since: '2016-06' },
    ],
  ],
} as const;
