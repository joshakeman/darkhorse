// src/components/Prose.tsx
export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose prose-neutral md:prose-lg leading-relaxed">
      {children}
    </div>
  );
}
