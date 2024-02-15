import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'data/blog');
const authorsDirectory = path.join(process.cwd(), 'data/authors');

export function getPosts() {
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames.map((fileName) => {
    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      slug: fileName.replace(/\.mdx$/, '').replace(/\.mdx$/, ''),
      content: matterResult.content,
      ...matterResult.data,
    };
  });

  allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));

  // calculate tag counts in all allPostsData list, each post have a tags array that contains list of tag
  const tagCounts = allPostsData.reduce((tags, post) => {
    post.tags.forEach((tag) => {
      if (tags[tag]) {
        tags[tag] += 1;
      } else {
        tags[tag] = 1;
      }
    });
    return tags;
  }, {});

  return {
    items: allPostsData,
    count: allPostsData.length,
    tagCounts,
  };
}

export async function getPostByPath(id) {
  const fullPath = path.join(postsDirectory, `${id}.mdx`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  return {
    id,
    content: matterResult.content,
    ...matterResult.data,
  };
}
