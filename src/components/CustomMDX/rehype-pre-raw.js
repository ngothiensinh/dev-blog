import { visit } from 'unist-util-visit';

export const preProcess = () => (tree) => {
  visit(tree, (node) => {
    if (node?.type === 'element' && node?.tagName === 'pre') {
      const [codeEl] = node.children;

      if (codeEl.tagName !== 'code') return;

      node.raw = codeEl.children?.[0].value;
    }
  });
};

export const postProcess = () => (tree) => {
  visit(tree, 'element', (node) => {
    if (node?.type === "element" && node?.tagName === "figure") {
      if (!("data-rehype-pretty-code-figure" in node.properties)) {
        return;
      }

      for (const child of node.children) {
        if (child.tagName === "pre") {
          child.properties["raw"] = node.raw;
        }
      }
    }
  });
};

// import { visit } from 'unist-util-visit';

// export const preProcess = () => (tree) => {
//   visit(tree, (node) => {
//     console.log(node?.tagName);
//     if (node?.type === 'element' && node?.tagName === 'pre') {
//       const [codeEl] = node.children;

//       if (codeEl.tagName !== 'code') return;

//       node.raw = codeEl.children?.[0].value;
//     }
//   });
// };

// export const postProcess = () => (tree) => {
//   visit(tree, 'element', (node) => {
//     if (node?.type === 'element' && node?.tagName === 'pre') {
//       node.properties['raw'] = 'jojo';
//       // console.log(node) here to see if you're getting the raw text
//     }
//   });
// };
