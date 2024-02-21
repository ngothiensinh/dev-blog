import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'data/blog');
const authorsDirectory = path.join(process.cwd(), 'data/authors');

export function getPosts() {
  const fileNames1 = fs.readdirSync(postsDirectory);
  const fileNames = readMdxFiles(postsDirectory);

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

function readMdxFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      readMdxFiles(name, files);
    } else {
      // only get the absolute path of the file start from data/blog
      files.push(name.replace(process.cwd(), '').split('blog/')[1]);
    }
  }

  return files;
}
