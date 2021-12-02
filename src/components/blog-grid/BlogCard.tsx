import { Component } from "solid-js";
import { Link } from "solid-app-router";
import { BlogInterface } from "../../stores/blogs/interfaces/blog.interface";

interface BlogCardProps {
  blog: BlogInterface;
}

/**
 * BlogCard
 *
 * BlogCard component represents a blog summary.
 */

const BlogCard: Component<BlogCardProps> = (props) => {
  return (
    <Link href={`/blog/post/${props.blog.id}`}>
      <div class="container mx-auto shadow-lg rounded-lg max-w-md hover:shadow-2xl transition duration-300">
        <img
          src={props.blog.cover.source.toString()}
          alt={props.blog.cover.description}
          class="rounded-t-lg w-full"
        />
        <div class="p-6">
          <h1 class="md:text-1xl text-xl hover:text-indigo-600 transition duration-200  font-bold text-gray-900 ">
            {props.blog.title}
          </h1>
          <p class="text-gray-700 my-2 hover-text-900 ">
            {props.blog.summary}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
