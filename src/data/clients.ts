import { buildLog } from './log';

export interface Project {
  name: string;
  url?: string;
}

export interface Client {
  /** The company or brand, as the credits and the `Kunder:` trailer name it. */
  name: string;
  /** Set when the work was the client's own site. */
  url?: string;
  /** Named projects for the client (from LinkedIn). The first with a link stands in for the client's. */
  projects?: Project[];
}

/**
 * Owner-stated and from the owner's LinkedIn projects. Links go to the ILLUMI case where there is one,
 * otherwise to the site while it still answers on its own domain.
 */
export const clients: Client[] = [
  { name: 'Aarhus Festuge', url: 'https://www.illumi.dk/cases/aarhus-festuge/' },
  { name: 'Aarhus Universitetsforlag' },
  { name: 'ARoS', url: 'https://www.illumi.dk/cases/aros/' },
  { name: 'Cult' },
  { name: 'DALI Speakers' },
  { name: 'Dansk Supermarked', projects: [{ name: 'Dansk Supermarked Group' }, { name: 'Føtex' }] },
  { name: 'Designa', projects: [{ name: 'Bricks' }] },
  { name: 'DK-CAMP', url: 'https://www.illumi.dk/cases/dk-camp/' },
  { name: 'Faarup Sommerland', url: 'https://www.faarupsommerland.dk' },
  { name: 'Fibia', projects: [{ name: 'Platform upgrade' }, { name: 'Redesign' }] },
  { name: 'Habitura' },
  { name: 'Hjem-IS', projects: [{ name: 'Fang Hjem-IS bilen' }] },
  { name: 'Housing Denmark' },
  { name: 'Innovationscenter for Økologisk Landbrug', url: 'https://www.illumi.dk/cases/innovationscenter-for-oekologisk-landbrug/' },
  { name: 'Ishøj Kommune' },
  { name: 'Kulturmødet Mors' },
  { name: 'Landbrug & Fødevarer', url: 'https://www.illumi.dk/cases/landbrug-og-foedevarer/' },
  { name: 'Lightyears' },
  { name: 'Mejeriforeningen', projects: [{ name: 'Skolemælk', url: 'https://www.skolemaelk.dk' }] },
  {
    name: 'NRGi',
    projects: [
      { name: 'Website', url: 'https://nrgi.dk' },
      { name: 'Mit NRGi', url: 'https://mit.nrgi.dk' },
    ],
  },
  { name: 'Normal' },
  { name: 'Ospra' },
  { name: 'Rationel', projects: [{ name: 'Website', url: 'https://www.rationel.dk' }, { name: 'Visit Report' }] },
  { name: 'Scandia Housing', projects: [{ name: 'Website' }, { name: 'CRM' }] },
  { name: 'Small Danish Hotels', projects: [{ name: 'Benefits' }, { name: 'Gavebeviser' }] },
  { name: 'Statens Serum Institut', url: 'https://www.ssi.dk' },
  { name: 'Sådan Bor Jeg' },
  { name: 'Troldtekt' },
  { name: 'Unipress', url: 'https://unipress.dk' },
  { name: 'Viking', url: 'https://www.illumi.dk/cases/viking-life-saving-equipment/' },
  { name: 'Yara' },
];

export interface Credit {
  name: string;
  url?: string;
}

/**
 * The credits, as `git log --format='%(trailers:key=Kunder,valueonly)' | awk '!seen[$0]++'` prints them:
 * log order, each role's own order, every client once. Every client must be on a role, and every role's defined.
 */
export const buildCredits = (list: Client[] = clients): Credit[] => {
  const order = [...new Set(buildLog().flatMap((row) => row.role?.clients ?? []))];
  for (const name of order) {
    if (!list.some((c) => c.name === name)) throw new Error(`Client "${name}" is on a role but not in clients`);
  }
  for (const { name } of list) {
    if (!order.includes(name)) throw new Error(`Client "${name}" is on no role`);
  }

  return order.map((name) => {
    const client = list.find((c) => c.name === name)!;
    return { name, url: client.url ?? client.projects?.find((p) => p.url)?.url };
  });
};
