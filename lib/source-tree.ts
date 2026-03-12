import type { Folder, Item, Node, Root } from "fumadocs-core/page-tree";
import { toRoman } from "@/lib/taxonomy/numbering";

const isFolder = (node: Node): node is Folder => node.type === "folder";
const isItem = (node: Node): node is Item => node.type === "page";

export const addNumberingToTree = (tree: Root): Root => {
  const cloneNode = (node: Node, ancestors: number[]): Node => {
    if (isFolder(node)) {
      const depth = ancestors.length + 1;
      const index = (ancestors[ancestors.length - 1] ?? 0) + 1;
      const current = [...ancestors.slice(0, -1), index];
      const prefix = buildPrefix(current, depth);

      const children = node.children.map((child, childIdx) =>
        cloneNode(child, [...current.slice(0, depth - 1), childIdx + 1]),
      );

      return {
        ...node,
        name: prefix ? `${prefix} ${node.name}` : node.name,
        children,
      };
    }

    if (isItem(node)) {
      const depth = ancestors.length;
      const prefix = buildPrefix(ancestors, depth);
      return {
        ...node,
        name: prefix ? `${prefix} ${node.name}` : node.name,
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
