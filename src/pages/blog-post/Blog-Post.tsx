import { useNavigate, useParams } from "solid-app-router";
import { Component, createResource, onMount, Show, ErrorBoundary, Suspense } from "solid-js";
import ContentfulRichText from "../../components/contentful-rich-text/ContentfulRichText";
import ServerError from "./../server-error/Server-Error";
import Spinner from "../../components/spinner/Spinner";
import NotFound from "./../not-found/Not-Found";
import { getBlogById } from "../../stores/blogs/blogs.store";

const BlogPost: Component = () => {
  const id = useParams().id;
  const [post] = createResource(id, getBlogById);

  /**
   * formtDateString()
   *
   * formats an ISO date string to be displayed.
   * @param dateStr the date to parse.
   */

  const formatDateString = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US");
  };

  return (
    <ErrorBoundary fallback={<ServerError />}>
      <Suspense>
        <Show when={post() != null} fallback={<NotFound />}>
          <div class="max-w-screen-lg mx-auto">
            <main class="mt-10">
              <div class="mb-4 md:mb-0 w-full mx-auto relative">
                <div class="px-4 lg:px-0">
                  <h1 class="text-4xl font-semibold text-gray-800 leading-tight">
                    {post()!.title}
                  </h1>
                  <span class="py-2 text-green-700 inline-flex items-center justify-center mb-2">
                    {formatDateString(post()!.created_at.date)}
                  </span>
                </div>

                <img
                  src={post()!.cover.source}
                  class="w-full object-contain lg:rounded"
                  style="height: 28em;"
                  alt={post()!.cover.description}
                />
              </div>

              <div class="px-2 py-4">
                <ContentfulRichText content={post()!.content} />
              </div>
            </main>
          </div>
        </Show>
      </Suspense>
    </ErrorBoundary>
  );
};

export default BlogPost;
