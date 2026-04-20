import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BRANDS = [
  { slug: 'one-com',     displayName: 'one.com',     logoPath: '/brand/one-com.svg',     sortOrder: 1  },
  { slug: 'checkdomain', displayName: 'checkdomain', logoPath: '/brand/checkdomain.svg', sortOrder: 2  },
  { slug: 'dogado',      displayName: 'Dogado',      logoPath: '/brand/dogado.svg',      sortOrder: 3  },
  { slug: 'metanet',     displayName: 'Metanet',     logoPath: '/brand/metanet.svg',     sortOrder: 4  },
  { slug: 'herold',      displayName: 'Herold',      logoPath: null,                     sortOrder: 5  },
  { slug: 'hostnet',     displayName: 'Hostnet',     logoPath: '/brand/hostnet.svg',     sortOrder: 6  },
  { slug: 'zoner',       displayName: 'Zoner',       logoPath: '/brand/zoner.svg',       sortOrder: 7  },
  { slug: 'uniweb',      displayName: 'Uniweb',      logoPath: '/brand/uniweb.svg',      sortOrder: 8  },
  { slug: 'webglobe',    displayName: 'Webglobe',    logoPath: '/brand/webglobe.svg',    sortOrder: 9  },
  { slug: 'alfahosting', displayName: 'Alfahosting', logoPath: null,                     sortOrder: 10 },
  { slug: 'easyname',    displayName: 'Easyname',    logoPath: '/brand/easyname.svg',    sortOrder: 11 },
  { slug: 'antagonist',  displayName: 'Antagonist',  logoPath: '/brand/antagonist.png',  sortOrder: 12 },
];

async function main() {
  for (const brand of BRANDS) {
    await prisma.brand.upsert({
      where: { slug: brand.slug },
      update: {
        displayName: brand.displayName,
        logoPath: brand.logoPath,
        sortOrder: brand.sortOrder,
      },
      create: brand,
    });
  }
  console.log(`Seeded ${BRANDS.length} brands.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
