/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';

import { slug } from 'github-slugger';
import { formatDate } from 'pliny/utils/formatDate';
import Link from '@/components/Link';
import Tag from '@/components/Tag';
import siteMetadata from '@/../data/siteMetadata';
import { usePathname } from 'next/navigation';

function Pagination({ totalPages, currentPage }) {
  const prevPage = currentPage - 1 > 0;
  const nextPage = currentPage + 1 <= totalPages;

  return (
    <div className='space-y-2 pb-8 pt-6 md:space-y-5'>
      <nav className='flex justify-between'>
        {!prevPage && (
          <button
            className='cursor-auto disabled:opacity-50'
            disabled={!prevPage}
          >
            Previous
          </button>
        )}
        {prevPage && (
          <Link href={`/blog/pages/${currentPage - 1}`} rel='prev'>
            Previous
          </Link>
        )}
        <span>
          {currentPage} of {totalPages}
        </span>
        {!nextPage && (
          <button
            className='cursor-auto disabled:opacity-50'
            disabled={!nextPage}
          >
            Next
          </button>
        )}
        {nextPage && (
          <Link href={`/blog/pages/${currentPage + 1}`} rel='next'>
            Next
          </Link>
        )}
      </nav>
    </div>
  );
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
  tagCounts,
}) {
  const pathname = usePathname();
  const tagKeys = Object.keys(tagCounts);
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a]);
  const displayPosts =
    initialDisplayPosts.length > 0 ? initialDisplayPosts : posts;

  return (
    <div className='flex flex-wrap'>
      <div className='' style={{ paddingRight: 20, paddingBottom: 20 }}>
        {pathname.startsWith('/blog') && !pathname.startsWith('/blog/tags') ? (
          <h3 className='font-bold uppercase text-primary-500'>All Posts</h3>
        ) : (
          <Link
            href={`/blog/pages/1`}
            className='font-bold uppercase text-gray-700 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500'
          >
            All Posts
          </Link>
        )}
        <ul>
          {sortedTags.map((t) => {
            return (
              <li key={t} className='my-3'>
                {pathname.split('/tags/')[1] === `${slug(t)}/` ? (
                  <h3 className='inline px-3 py-2 text-sm font-bold uppercase text-primary-500'>
                    {`${t} (${tagCounts[t]})`}
                  </h3>
                ) : (
                  <Link
                    href={`/blog/tags/${slug(t)}`}
                    className='px-3 py-2 text-sm font-medium uppercase text-gray-500 hover:text-primary-500 dark:text-gray-300 dark:hover:text-primary-500'
                    aria-label={`View posts tagged ${t}`}
                  >
                    {`${t} (${tagCounts[t]})`}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <div className=''>
        <ul>
          {displayPosts.map((post) => {
            const { slug, date, title, summary, tags } = post;
            return (
              <li key={slug} style={{ paddingBottom: 20 }}>
                <article className='flex flex-col space-y-2 xl:space-y-0'>
                  <div className='space-y-3'>
                    <div>
                      <h2 className='text-2xl font-bold leading-8 tracking-tight'>
                        <Link
                          href={`/blog/${slug}`}
                          className='text-gray-900 dark:text-gray-100'
                        >
                          {title}
                        </Link>
                      </h2>

                      <dl>
                        <dt className='sr-only'>Published on</dt>
                        <dd className='text-base font-medium leading-6 text-gray-500 dark:text-gray-400'>
                          <time dateTime={date}>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </dd>
                      </dl>
                      <div className='prose max-w-none text-gray-500 dark:text-gray-400'>
                        {summary}
                      </div>
                    </div>
                    <div className='flex flex-wrap'>
                      {tags?.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        {pagination && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
          />
        )}
      </div>
    </div>
  );
}
