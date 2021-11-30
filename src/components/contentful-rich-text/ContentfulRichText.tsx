import { Component, onMount } from "solid-js";
import hljs from "highlight.js";
import { documentToHtmlString,  } from "@contentful/rich-text-html-renderer";
import { Document, BLOCKS, INLINES, MARKS, Hyperlink, AssetLinkBlock } from "@contentful/rich-text-types";

// css
import "highlight.js/styles/github.css";

/**
 * ContentfulRichTextProps
 *
 * The props for the ContentfulRichText component.
 */

interface ContentfulRichTextProps {
  content: Document;
}

/**
 * ContentfulRichText
 *
 * ContentfulRichText is a component that renders the contents of a Contentful Rich Text Box.
 */

const ContentfulRichText: Component<ContentfulRichTextProps> = (props) => {
  onMount(() => {});

  const parseContent = (): string => {
    return documentToHtmlString(props.content, {
      renderNode: {
        [BLOCKS.PARAGRAPH]: (node, next) =>
          `<p class='pb-6'>${next(node.content)}</p>`,
        [BLOCKS.DOCUMENT]: (node, next) =>
          `<div class="px-4 lg:px-0 mt-12 text-gray-700 text-lg leading-relaxed w-full">${next(
            node.content
          )}</div>`,
        [BLOCKS.HEADING_1]: (
          node,
          next
        ) => `<h2 class="text-2xl text-gray-800 font-semibold mb-4 mt-4">
              ${next(node.content)}
            </h2>`,
        [BLOCKS.HEADING_2]: (
          node,
          next
        ) => `<h3 class="text-xl text-gray-800 font-semibold mb-4 mt-4">
              ${next(node.content)}
            </h3>`,
        [BLOCKS.HEADING_3]: (
          node,
          next
        ) => `<h4 class="text-lg text-gray-800 font-semibold mb-4 mt-4">
              ${next(node.content)}
            </h4>`,
        [BLOCKS.HEADING_4]: (
          node,
          next
        ) => `<h5 class="text-md text-gray-800 font-semibold mb-4 mt-4">
              ${next(node.content)}
            </h5>`,
        [BLOCKS.QUOTE]: (node, next) =>
          `<div class="border-l-4 border-gray-500 pl-4 mb-6 italic rounded">${next(
            node.content
          )}</div>`,
        [BLOCKS.EMBEDDED_ASSET]: (node, next) => {
          return `
          <div class="flex flex-wrap justify-center">
            <div class="w-6/12 sm:w-4/12 px-4">
              <img src="https://${node.data.target.fields.file.url}" alt="${node.data.target.fields.title}" class="shadow rounded max-w-full h-auto align-middle border-none" />
            </div>
          </div>
          `;
        },
        [INLINES.HYPERLINK]: (node, next) => {
          const hyperlink = node as Hyperlink;
          return `<a href=${
            hyperlink.data.uri
          }><span class = "text-primary underline">${next(
            node.content
          )}</span></a>`;
        },
      },
      renderMark: {
        [MARKS.BOLD]: (text) => `<strong class = "text-bold">${text}</strong>`,
        [MARKS.ITALIC]: (text) => `<span class = "italic">${text}</span>`,
        [MARKS.UNDERLINE]: (text) => `<span class = "underline">${text}</span>`,
        [MARKS.CODE]: (text) => {
          const parser = new DOMParser();
          const htmlObj = parser.parseFromString(text, "text/html");
          return `<pre><code>${
            hljs.highlightAuto(htmlObj.documentElement.textContent!).value
          }</code></pre>`;
        },
      },
    });
  };

  return (
    <div
      innerHTML={parseContent()}
      class="mb-4 md:mb-0 w-full mx-auto relative"
    />
  );
};

export default ContentfulRichText;
