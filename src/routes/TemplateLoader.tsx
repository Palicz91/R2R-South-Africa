import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";

// Glob all supported templates (both formats)
const templates = import.meta.glob([
  "/src/pages/templates/**/**/*.tsx", // supports /vertical/slug/version.tsx
  "/src/pages/templates/**/**/index.tsx", // supports /vertical/slug/version/index.tsx
]);

const NotFound = () => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Template Not Found</h2>
    <p className="text-gray-600">The requested template could not be found.</p>
  </div>
);

export default function TemplateLoader() {
  const { vertical, slug, version } = useParams();

  const flatPath = version
    ? `/src/pages/templates/${vertical}/${slug}/${version.replace(".", "_")}.tsx`
    : null;
  const nestedPath = `/src/pages/templates/${vertical}/${slug}/${version}/index.tsx`;

  const matchedPath = flatPath && templates[flatPath]
    ? flatPath
    : templates[nestedPath]
    ? nestedPath
    : null;

  const Page = matchedPath ? lazy(templates[matchedPath] as any) : null;

  return (
    <Suspense fallback={<div className="p-10 text-center">Loading template...</div>}>
      {Page ? <Page /> : <NotFound />}
    </Suspense>
  );
}
