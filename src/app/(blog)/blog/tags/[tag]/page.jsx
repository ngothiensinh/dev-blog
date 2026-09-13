import { slug } from 'github-slugger';
import { allCoreContent, sortPosts } from 'pliny/utils/contentlayer';
import ListLayout from '@/layouts/ListLayoutWithTags';
import { getPosts } from '@/../data/lib/dataLayer';

export const generateStaticParams = async () => {
  const tagCounts = getPosts().tagCounts;
  const tagKeys = Object.keys(tagCounts);
  const paths = tagKeys.map((tag) => ({
    tag: encodeURI(tag),
  }));
  return paths;
};

export default function TagPage({ params }) {
  const tag = decodeURI(params.tag);
  // Capitalize first letter and convert space to dash
  const title = tag[0].toUpperCase() + tag.split(' ').join('-').slice(1);
  const dataSrc = getPosts();
  const filteredPosts = dataSrc.items.filter(
    (post) => post.tags && post.tags.map((t) => slug(t)).includes(tag)
  );
  return (
    <ListLayout
      posts={filteredPosts}
      title={title}
      tagCounts={dataSrc.tagCounts}
    />
  );
}
