import ListLayout from '@/layouts/ListLayoutWithTags';
import { getPosts } from '@/../data/lib/dataLayer';

const POSTS_PER_PAGE = 10;

export const generateStaticParams = async () => {
  const dataSrc = getPosts();
  const totalPages = Math.ceil(dataSrc.count / POSTS_PER_PAGE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));

  return paths;
};

export default function BlogPage({ params }) {
  const dataSrc = getPosts();
  const posts = dataSrc.items;
  const pageNumber = params.page ? parseInt(params.page) : 1;
  const initialDisplayPosts = posts.slice(
    POSTS_PER_PAGE * (pageNumber - 1),
    POSTS_PER_PAGE * pageNumber
  );

  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(posts.length / POSTS_PER_PAGE),
  };

  return (
    <ListLayout
      posts={posts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      tagCounts={dataSrc.tagCounts}
      title='All Posts'
    />
  );
}
