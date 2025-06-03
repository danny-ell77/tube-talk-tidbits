import { Helmet } from 'react-helmet';

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

export function Metadata({
  title = 'Digestly - Video Summaries Made Easy',
  description = 'Turn YouTube videos into concise, readable summaries and articles with Digestly. Save time and extract key insights from any video content.',
  image = `${window.location.origin}/og-image.jpg`,
  url = window.location.href,
}: MetadataProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
