import { getProjects } from '../../../lib/contentful';

export const revalidate = 60; // ISR every 60s

export default async function BlogIndex() {
  const posts = await getProjects(20);
  console.log('Fetched posts:', posts.length);
  console.log("Posts data:", posts);
  return (
    <main className="prose">
      <h1>Blog</h1>
      <ul>
        {posts.map(p => (
          <li key={p.sys.id}>
            {/* <a href={`/blog/${p.fields.slug}`}>{p.fields.title}</a> */}
          </li>
        ))}
      </ul>
    </main>
  );
}
