import {
  Component,
  For,
  ErrorBoundary,
  Suspense,
  createResource,
} from "solid-js";
import { Link } from "solid-app-router";
import MessageBox from "./../message-box/MessageBox";
import Spinner from "./../spinner/Spinner";
import { getLattestBlogs } from "../../stores/blogs/blogs.store";
import { getMessageForError, getTrimmedBlogList } from "./blog-overview.fns";

/**
 * BlogSummary Component
 *
 * The BlogSummary component shows the latest blogs.
 * For the BlogSummary Component, we use this:
 * https://tailwindcomponents.com/component/responsive-blog-cards-1
 */

const BlogOverview: Component = () => {
  // contains the projects to display.
  const [blogs, { refetch }] = createResource(true, getLattestBlogs);

  return (
    <section class="max-w-7xl mx-auto pt-2 px-4 sm:px-6 lg:px-4 mb-12">
      <article>
        <h2 class="text-2xl font-extrabold text-primary">LATEST BLOGS</h2>
        <ErrorBoundary
          fallback={(error, reset) => (
            <MessageBox
              message={getMessageForError(error)}
              actionText="Retry"
              onConfirm={() => {
                refetch();
                reset();
              }}
            />
          )}
        >
          <section class="mt-6 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-8">
            <Suspense fallback={<Spinner />}>
              <For each={getTrimmedBlogList(blogs())} fallback={<h1>No Content</h1>}>
                {(blog, index) => (
                  <article
                    class="relative w-full h-64 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl  transition duration-300 ease-in-out"
                    style={{
                      "background-image": `url(${blog.cover.source.toString()})`,
                    }}
                  >
                    <div class="absolute inset-0 bg-black bg-opacity-50 group-hover:opacity-75 transition duration-300 ease-in-out"></div>
                    <div class="relative w-full h-full px-4 sm:px-6 lg:px-4 flex justify-center items-center">
                      <h3 class="text-center">
                        <Link
                          class="text-white text-2xl font-bold text-center"
                          href={`/blog/post/${blog.id}`}
                        >
                          <span class="absolute inset-0"></span>
                          {blog.title}
                        </Link>
                      </h3>
                    </div>
                  </article>
                )}
              </For>
            </Suspense>
          </section>
        </ErrorBoundary>
      </article>
    </section>
  );
};

export default BlogOverview;
