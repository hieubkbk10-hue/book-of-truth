import type { Folder, Item, Node, Root } from "fumadocs-core/page-tree";
import { toRoman } from "@/lib/taxonomy/numbering";

const isFolder = (node: Node): node is Folder => node.type === "folder";
const isItem = (node: Node): node is Item => node.type === "page";

const withPrefix = (name: Node["name"], prefix: string): Node["name"] => {
  if (!prefix) return name;
  return [prefix, " ", name];
};

export const addNumberingToTree = (tree: Root): Root => {
  const cloneNode = (node: Node, ancestors: number[]): Node => {
    if (isFolder(node)) {
      const depth = ancestors.length;
      const prefix = buildPrefix(ancestors, depth);

      const children = node.children.map((child, childIdx) =>
        cloneNode(child, [...ancestors, childIdx + 1]),
      );

      return {
        ...node,
        name: withPrefix(node.name, prefix),
        children,
      };
    }

    if (isItem(node)) {
      const depth = ancestors.length;
      const prefix = buildPrefix(ancestors, depth);
      return {
        ...node,
        name: withPrefix(node.name, prefix),
      };
    }

    return node;
  };

  return {
    ...tree,
    children: tree.children.map((child, idx) => cloneNode(child, [idx + 1])),
  };
};

const buildPrefix = (indexes: number[], depth: number) => {
  if (depth === 0) return "";
  if (depth === 1) return `${toRoman(indexes[0] ?? 0)}.`;
  if (depth === 2) return `${indexes[0]}.`;
  if (depth === 3) return `${indexes[0]}.${indexes[1]}.`;
  return indexes.join(".") + ".";
};
