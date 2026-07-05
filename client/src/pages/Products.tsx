import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Product } from "../types";
import { categoriesData, dummyProducts } from "../assets/assets";
import { ChevronDown, Home, SlidersHorizontal, XIcon } from "lucide-react";
import ProductCard from "../components/ProductCard";
import Loading from "../components/Loading";
import FilterPanel from "../components/FilterPanel";

const Products = () => {
  // 1
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const organic = searchParams.get("organic") || "";
  const sort = searchParams.get("sort") || "";
  const page = Number(searchParams.get("page")) || 1;
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  // 2. fetch data
  const fetchProducts = async () => {
    setLoading(true);
    setProducts(
      dummyProducts.filter((p) => p.category === category || category === ""),
    );
    setLoading(false);
  };

  // 4.
  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value); // if value is aval then provide key and value to the newParams , whenever update the filter set the key and value in the url
    } else {
      newParams.delete(key, value);
    }
    if (key !== "page") {
      newParams.delete("page");
    }
    setSearchParams(newParams);
  };

  //5.
  const clearFilter = () => setSearchParams({}); //This function clear all the filter

  //6. It will find the active category
  const activeCategory = categoriesData.find((c) => c.slug === category);

  // 7.
  const hasFilters = category || organic || minPrice || maxPrice;

  //3
  useEffect(() => {
    fetchProducts();
  }, [category, organic, sort, page, minPrice, maxPrice]);

  //8. now display the data
  return (
    <div className="min-h-screen bg-app-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* First display the Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link to="/" className="hover:text-app-green transition-colors">
            <Home className="size-4" />
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium">
            {activeCategory ? activeCategory.name : "All Products"}
          </span>
        </nav>
        {/* in this section we have to add content for desktop screen that will our filter section */}
        <div className="flex gap-8 xl:gap-10">
          {/* Sidebar for desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl p-4 sticky top-24">
              <FilterPanel
                categories={categoriesData}
                category={category}
                organic={organic}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={updateFilter}
                clearFilters={clearFilter}
                hasFilters={hasFilters}
              />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              {/* Show number of product based on active category */}
              <div>
                <h1 className="text-2xl font-semibold text-app-green">
                  {activeCategory ? activeCategory.name : "All Products"}
                </h1>
                <p className="text-sm text-app-text-light mt-0.5">
                  {products.length} products found
                </p>
              </div>

              {/*  */}
              <div className="flex flex-col lg:items-center gap-3">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 text-sm bg-white rounded-xl border border-app-border hover:bg-app-cream transition-colors"
                >
                  <SlidersHorizontal className="size-4" /> Filters
                </button>
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => updateFilter("sort", e.target.value)}
                    className="pl-3 appearance-none pr-8 py-2 text-sm bg-white rounded-xl border border-app-border focus:border-app-green outline-none cursor-pointer"
                  >
                    <option value="">Newst</option>
                    <option value="price_asc">Price: Low → High </option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="name">A → Z</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-app-text-light pointer-events-none" />
                </div>
              </div>
            </div>
            {/* Product grid */}
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-semibold text-app-green mb-2">
                  No product found
                </p>
                <p className="text-sm text-app-text-light mb-4">
                  Try adjusting your filters or search terms
                </p>
                <button
                  onClick={clearFilter}
                  className="px-5 py-2 text-sm font-medium bg-app-green text-white rounded-xl hover:bg-app-green-light transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 xl:gap-8">
                {products.map(
                  (product) =>
                    product.stock > 0 && (
                      <ProductCard key={product._id} product={product} />
                    ),
                )}
              </div>
            )}
            {/* pagination */}
            {totalPages > 1 && (
              <div className="flex-center gap-2 mt-16">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    onClick={() => {
                      updateFilter("page", String(i + 1));
                      scrollTo(0, 0);
                    }}
                    key={i}
                    className={`size-9 rounded-lg text-sm font-medium transition-colors ${page == i + 1 ? "bg-app-green text-white" : "bg-white text-app-text-light hover:bg-app-cream"}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
      {/* Mobile Filters Modal */}
      {mobileFiltersOpen && (
        <>
          {/* This is self closing div */}
          <div
            onClick={() => setMobileFiltersOpen(false)}
            className="fixed inset-0 bg-black/40 z-50"
          />
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl max-h-[80vh] overflow-y-auto animate-slide-in-up">
            <div className="flex items-center justify-between p-4 border-b border-app-border">
              <h3 className="text-lg font-semibold text-app-green">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 hover:bg-app-cream rounded-lg"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            {/* Mount here  */}
            <div className="p-4">
              <FilterPanel
                categories={categoriesData}
                category={category}
                organic={organic}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={updateFilter}
                clearFilters={clearFilter}
                hasFilters={hasFilters}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
