import { Link } from "solid-app-router";
import {
  For,
  Show,
  ErrorBoundary,
  Suspense,
  Component,
  createMemo,
  createResource,
} from "solid-js";
import { getLatestProjects } from "../../stores/projects/projects.store";
import Spinner from "./../spinner/Spinner";
import MessageBox from "./../message-box/MessageBox";
import { RequestTimedoutException } from "../../utils/errors/request-timed-out.exception";
import { ProjectInterface } from "../../stores/projects/interfaces/project.interface";
import { getMessgeForError, getTrimmedProjectList } from './portfolio-overview.fns';

/**
 * PortfolioOverview Component
 *
 * The PortfolioOverview component shows the latest projects from the portfolio.
 * For the PortfolioSummary Component, we use this:
 * https://tailwindcomponents.com/component/responsive-blog-cards-1
 */

const PortfolioOverview: Component = () => {

  // contains the projects to display.
  const [ projects, { refetch}] = createResource(true, getLatestProjects);

  return (
    <section class="max-w-7xl mx-auto pt-2 px-4 sm:px-6 lg:px-4 mb-12">
      <article>
        <h2 class="text-2xl font-extrabold text-primary">LATEST PROJECTS</h2>
        <ErrorBoundary
          fallback={(error, reset) =>
            <MessageBox
              message={getMessgeForError(error)}
              actionText="Retry"
              onConfirm={() => {
                reset();
                refetch();
              }}
            />
          }
        >
          <section class="mt-6 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-x-6 gap-y-8">
            <Suspense fallback={<Spinner />}>
              <For each={getTrimmedProjectList(projects())} fallback={<h1>No Content</h1>}>
                {(project, index) => (
                  <article
                    class="relative w-full h-64 bg-cover bg-center group rounded-lg overflow-hidden shadow-lg hover:shadow-2xl  transition duration-300 ease-in-out"
                    style={{ 'background-image': `url(${project.logo.source.toString()})`}}
                  >
                    <div class="absolute inset-0 bg-black bg-opacity-50 group-hover:opacity-75 transition duration-300 ease-in-out"></div>
                    <div class="relative w-full h-full px-4 sm:px-6 lg:px-4 flex justify-center items-center">
                      <h3 class="text-center">
                        <Link
                          class="text-white text-2xl font-bold text-center"
                          href={`/portfolio/project/${project.id}`}
                        >
                          <span class="absolute inset-0"></span>
                          {project.title}
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

export default PortfolioOverview;
