import { PageHeader } from "@/components/PageHeader";
import { CategoryExplorer } from "@/components/CategoryExplorer";
import { getByCategory, type Category } from "@/lib/data";
import { categoryPageContent } from "@/lib/category-pages";

/**
 * Shared shell for every /jobs, /results, /admit-card, /scholarship and
 * /yojana route. Each route file just passes its category — this is the
 * one place that renders the header + filterable listing grid.
 */
export function CategoryPage({ category }: { category: Category }) {
  const { eyebrow, title, description } = categoryPageContent[category];
  const items = getByCategory(category);

  return (
    <div>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <CategoryExplorer items={items} />
      </div>
    </div>
  );
}
