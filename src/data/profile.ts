export const profile = {
  name: 'Daniel Toft',
  title: 'Softwarearkitekt & udvikler',
  city: 'Aarhus',
  /** The root of the log: `Initial commit`. */
  born: '1989-08-20',
  email: 'mail@danieltoft.dk',
  github: { handle: 'DanielToft', url: 'https://github.com/DanielToft' },
  linkedin: { handle: 'danieltoft89', url: 'https://www.linkedin.com/in/danieltoft89' },
  lead: 'Softwarearkitekt & udvikler i Aarhus.',
  /** One string per paragraph. */
  about: [
    'Jeg har arbejdet med software siden 2008, fra lærling hos Bang & Olufsen til Software, Cloud & Platform Architect hos ILLUMI. Jeg har arbejdet med C# og .NET på Microsoft-platformen fra starten og har gennem årene beskæftiget mig bredt med både frontend, backend og cloud.',
    'Mit primære fokus er softwaredesign og arkitektur, hele vejen fra kode og applikationsarkitektur til den platform, løsningen kører på. Jeg går især op i performance, sikkerhed og robuste løsninger og har stor erfaring med cloud-teknologi, primært Microsoft Azure.',
  ],
} as const;
