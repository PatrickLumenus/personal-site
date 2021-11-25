import { Component } from "solid-js";
import { Link } from "solid-app-router";
import { ProjectInterface } from './../../stores/projects/interfaces/project.interface';

interface BlogCardProps {
  project: ProjectInterface;
}

/**
 * ProjectCard
 *
 * BlogCard component represents a project summary.
 */

const ProjectCard: Component<BlogCardProps> = (props) => {
  return (
    <Link href={`/portfolio/project/${props.project.id}`}>
      <div class="container mx-auto shadow-lg rounded-lg max-w-md hover:shadow-2xl transition duration-300">
        <img
          src={props.project.logo.source.toString()}
          alt={props.project.logo.description}
          class="rounded-t-lg w-full"
        />
        <div class="p-6">
          <h1 class="md:text-1xl text-xl hover:text-indigo-600 transition duration-200  font-bold text-gray-900 ">
            {props.project.title}
          </h1>
          <p class="text-gray-700 my-2 hover-text-900 ">{props.project.short_description}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
