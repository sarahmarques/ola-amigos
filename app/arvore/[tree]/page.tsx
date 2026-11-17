import { trees } from "@/content/trees";
import { TreeView } from "@/components/tree/TreeView";

export const dynamicParams = false;

export function generateStaticParams() {
  return trees.map((t) => ({ tree: t.id }));
}

export default async function TreePage({ params }: { params: Promise<{ tree: string }> }) {
  const { tree } = await params;
  return <TreeView treeId={tree} />;
}
