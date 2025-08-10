import AuditClient from './AuditClient';

// Static generation for the known audit slugs
export async function generateStaticParams() {
  // You can expand this list as you add more audits
  const auditSlugs = [
    'passwordstore-v1',
  ];
  
  return auditSlugs.map((slug) => ({
    slug: slug,
  }));
}

export default function AuditPage({ params }: { params: { slug: string } }) {
  return <AuditClient slug={params.slug} />;
}