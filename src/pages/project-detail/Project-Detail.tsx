import { useParams } from "solid-app-router";
import { Component, createResource, onMount, Show, For, ErrorBoundary, Suspense } from "solid-js";
import { getProjectById } from "../../stores/projects/projects.store";
import ContentfulRichText from "../../components/contentful-rich-text/ContentfulRichText";
import Spinner from "../../components/spinner/Spinner";
import ServerError from "../server-error/Server-Error";
import NotFound from "../not-found/Not-Found";
import Tag from '../../components/tag/Tag';

/**
 * ProjectDetail
 * 
 * The ProjectDetail page.
 */

const ProjectDetail: Component = () => {
  const id = useParams().id;
  const [ project ] = createResource(id, getProjectById);
  
  return (
    <ErrorBoundary fallback={<ServerError />}>
      <Suspense fallback={<Spinner />}>
        <Show when={project() != null} fallback={<NotFound />}>
          <div class="max-w-screen-lg mx-auto">
            <main class="mt-10">
              <div class="mb-4 md:mb-0 w-full mx-auto relative">
                <div class="px-4 lg:px-0">
                  <h1 class="text-4xl font-semibold text-gray-800 leading-tight">
                    {project()!.title}
                  </h1>
                </div>

                <img
                  src={project()!.logo.source.toString()}
                  class="w-full object-contain lg:rounded mb-12"
                  style="height: 28em;"
                />
              </div>

              <div class="flex flex-col lg:flex-row lg:space-x-12 px-2">
                <ContentfulRichText content={project()!.description} />
                <div class="w-full lg:w-1/4 m-auto mt-12 max-w-screen-sm">
                  <div class="p-4 border-t border-b md:border md:rounded">
                    <Show when={project()!.technologies.length > 0}>
                      <div class="px-6 pt-4 pb-2">
                        <h2 class="text-xl text-semibold my-4">
                          Developed with:{" "}
                        </h2>
                        <For each={project()!.technologies}>
                          {(tag) => <Tag title={tag} />}
                        </For>
                      </div>
                    </Show>
                    <a
                      href={project()!.repository.toString()}
                      class="px-2 py-1 my-2 text-white bg-primary flex w-full items-center justify-center rounded"
                    >
                      View Repository
                    </a>
                    <Show when={project()!.website != null}>
                      <a
                        href={project()!.website!.toString()}
                        class="px-2 py-1 my-2 text-white bg-primary flex w-full items-center justify-center rounded"
                      >
                        View Website
                      </a>
                    </Show>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </Show>
      </Suspense>
    </ErrorBoundary>
  );
};

export default ProjectDetail;
