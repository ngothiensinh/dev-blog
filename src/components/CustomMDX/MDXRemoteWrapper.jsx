import { MDXRemote } from 'next-mdx-remote/rsc';
import Pre from './Pre';
import remarkGfm from 'remark-gfm';
import './mdx.css';
import rehypePrettyCode from 'rehype-pretty-code';

import { preProcess, postProcess } from './rehype-pre-raw';
import TableWrapper from './Table/TableWrapper';

const rehypeCodeOptions = {
  theme: 'one-dark-pro',
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      preProcess,
      [rehypePrettyCode, rehypeCodeOptions],
      postProcess,
    ],
  },
};

const components = {
  pre: (props) => <Pre {...props} />,
  table: TableWrapper,
};

export default function MDXRemoteWrapper({ mdxContent }) {
  return (
    <MDXRemote
      source={mdxContent}
      options={options}
      components={components}
    />
  );
}
