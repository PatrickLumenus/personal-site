import { Component, Show } from "solid-js";

/**
 * The base tag props interface defines the props for a basic label tag.
 */

interface TagProps {
  title: string;
}

/**
 * The ActionableTageProps interface defines the props for a clickable tag.
 */

interface ActionableTagProps extends TagProps {
  onClick?: () => void;
}

/**
 * LabelTag
 *
 * A label tag component, which has no functionality.
 */
const LabelTag: Component<TagProps> = (props) => {
  return (
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
      {props.title}
    </span>
  );
};

/**
 * ActionableTag
 *
 * A clickable tag.
 */

const ActionableTag: Component<ActionableTagProps> = (props) => {
  return (
    <button
      class="button inline-block bg-primary rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2"
      onClick={props.onClick}
    >
      {props.title}
    </button>
  );
};

/**
 * Tag
 *
 * The main tag component.
 */

const Tag: Component<ActionableTagProps> = (props) => {
  return (
    <Show when={props.onClick} fallback={<LabelTag title={props.title} />}>
      <ActionableTag title={props.title} onClick={props.onClick} />
    </Show>
  );
};

export default Tag;
