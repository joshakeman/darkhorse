// src/app/blog/page.tsx
import PageHeader from "../components/PageHeader";
import BlogCard from "../components/BlogCard";
import { getBlogPosts } from "../../../lib/contentful";

export const revalidate = 60;

export default async function BlogIndexPage() {
  const posts = await getBlogPosts(30);

  return (
    <article className="container mx-auto px-4 pb-20">
      <PageHeader title="Blog" subtitle="Notes from the shop: projects, materials, and methods." imageSrc="/triptych-process.jpg" />

      <section className="mx-auto max-w-6xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <BlogCard key={p.sys.id} post={p} />
          ))}
        </div>
      </section>
    </article>
  );
}
