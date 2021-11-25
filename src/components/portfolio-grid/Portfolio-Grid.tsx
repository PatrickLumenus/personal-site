import {
  Component,
  For,
  createResource,
  ErrorBoundary,
  Suspense,
} from "solid-js";
import PortfolioCard from "./Portfolio-Card";
import Spinner from "./../spinner/Spinner";
import MessageBox from "../message-box/MessageBox";
import { getMessageForError } from "./portfolio-grid.fns";
import { getLatestProjects } from "../../stores/projects/projects.store";

const PortfolioGrid: Component = () => {
  const [blogs, { refetch }] = createResource(true, getLatestProjects);

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <MessageBox
          actionText="retry"
          onConfirm={() => {
            reset();
            refetch();
          }}
          message={getMessageForError(error)}
        />
      )}
    >
      <Suspense fallback={<Spinner />}>
        <div class="bg-gray-100 min-h-screen py-32 px-10 ">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-10 xl-grid-cols-4 gap-y-10 gap-x-6 ">
            <For each={blogs() ? blogs() : []} fallback={<h3> No Content </h3>}>
              {(blog, index) => <PortfolioCard project={blog} />}
            </For>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default PortfolioGrid;
