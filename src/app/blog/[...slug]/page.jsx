import PostLayout from './PostLayout';
import { notFound } from 'next/navigation';
import { getPostByPath, getPosts } from '../../../../data/lib/dataLayer';
import MDXRemoteWrapper from '@/components/CustomMDX/MDXRemoteWrapper';

export async function generateStaticParams() {
  const posts = getPosts();

  return posts.map((post, i) => {
    return {
      slug: post.slug.split('/'),
      post: post,
      nextPost: i === 0 ? null : posts[i - 1],
      prevPost: i === posts.length - 1 ? null : posts[i + 1],
    };
  });
}

export default async function Page({ params }) {
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
      avatar: 'images/avatar.jpg',
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
