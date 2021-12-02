import {
  Component,
  For,
  Show,
  createResource,
  ErrorBoundary,
  Suspense,
} from "solid-js";
import PortfolioCard from "./Portfolio-Card";
import Spinner from "./../spinner/Spinner";
import MessageBox from "../message-box/MessageBox";
import { getMessageForError } from "./portfolio-grid.fns";
import { getLatestProjects, hasUnloadedProjectContent } from "../../stores/projects/projects.store";

const PortfolioGrid: Component = () => {
  const [blogs, { refetch }] = createResource(true, getLatestProjects);

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <MessageBox
          actionText="retry"
          onConfirm={() => {
            refetch();
            reset();
          }}
          message={getMessageForError(error)}
        />
      )}
    >
      <Suspense fallback={<Spinner />}>
        <div class="flex content-center justify-center py-4">
          <h1 class="text-primary text-4xl">Portfolio</h1>
        </div>
        <div class="bg-white min-h-screen py-32 px-10 ">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-10 xl-grid-cols-4 gap-y-10 gap-x-6 ">
            <For each={blogs() ? blogs() : []} fallback={<h3> No Content </h3>}>
              {(blog, index) => <PortfolioCard project={blog} />}
            </For>
          </div>
          <Show when={hasUnloadedProjectContent()}>
            <div class="flex content-center justify-center py-4 h-full">
              <button
                onClick={refetch}
                class="bg-primary rounded-md font-bold text-white text-center px-4 py-3 transition duration-300 ease-in-out hover:bg-white hover:text-primary mr-2"
              >
                Load More
              </button>
            </div>
          </Show>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default PortfolioGrid;
