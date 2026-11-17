import { getWord, trees, unitsForTree } from "@/content";

/**
 * For parents: every tree, its units, and each word with its English meaning
 * and a rough pronunciation guide, so they can practise along with their child.
 */
export function WordList() {
  return (
    <div className="flex flex-col gap-3">
      {trees.map((tree, i) => {
        const treeUnits = unitsForTree(tree.id);
        return (
          <details key={tree.id} open={i === 0} className="rounded-2xl bg-mint/60 p-3 open:pb-4">
            <summary className="flex cursor-pointer list-none items-center gap-3 text-lg">
              <span className="text-2xl">{tree.emoji}</span>
              <span lang="pt-PT" className="font-bold">
                {tree.name}
              </span>
              <span className="text-slate-600">
                {tree.en} · ages {tree.minAge}+
              </span>
              <span className="ml-auto text-sm text-slate-500">
                {treeUnits.length > 0 ? `${treeUnits.length} units` : "coming soon"}
              </span>
            </summary>

            {treeUnits.map((unit) => (
              <section key={unit.id} className="mt-4">
                <h3 className="mb-2 font-bold">
                  {unit.emoji} <span lang="pt-PT">{unit.title.pt}</span>{" "}
                  <span className="font-normal text-slate-600">— {unit.title.en}</span>
                </h3>
                <table className="w-full text-left text-sm sm:text-base">
                  <thead className="text-slate-500">
                    <tr>
                      <th className="py-1 pr-2 font-normal">Portuguese</th>
                      <th className="py-1 pr-2 font-normal">English</th>
                      <th className="py-1 font-normal">Say it like</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unit.wordIds.map(getWord).map((w) => (
                      <tr key={w.id} className="border-t border-gum/15 align-top">
                        <td lang="pt-PT" className="py-1.5 pr-2 font-bold text-gum-deep">
                          <span aria-hidden className="mr-1">
                            {w.emoji}
                          </span>
                          {w.pt}
                        </td>
                        <td className="py-1.5 pr-2">{w.en}</td>
                        <td className="py-1.5 text-slate-600">
                          <span className="italic">{w.hint}</span>
                          {w.note && <span className="block text-xs text-slate-500">{w.note}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            ))}
          </details>
        );
      })}
      <p className="text-sm text-slate-500">
        Pronunciation guides are approximate — the audio in the lessons is the reference.
      </p>
    </div>
  );
}
