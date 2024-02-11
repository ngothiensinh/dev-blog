import PostLayout from './PostLayout';
import { notFound } from 'next/navigation';
import { getPostByPath, getPosts } from '../../../../data/lib/dataLayer';
import MDXRemoteWrapper from '@/components/CustomMDX/MDXRemoteWrapper';

export default async function BlogDetailPage({ params }) {
  const slug = decodeURI(params.slug.join('/'));
  const posts = getPosts();

  const postIndex = posts.findIndex((p) => p.slug === slug);
  if (postIndex === -1) {
    return notFound();
  }

  const prevPost = postIndex[postIndex + 1];
  const nextPost = postIndex[postIndex - 1];
  const post = await getPostByPath(slug);

  const authorDetails = [
    {
      name: 'sinhnt',
      avatar: '/images/avatar.png',
      twitter: 'https://twitter.com/sinhnt',
    },
  ];

  return (
    <>
      <PostLayout
        content={post}
        authorDetails={authorDetails}
        nextPost={nextPost}
        prevPost={prevPost}
      >
        <MDXRemoteWrapper mdxContent={post.content} />
      </PostLayout>
    </>
  );
}
