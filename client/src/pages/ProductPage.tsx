import { Link, useNavigate, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import type { Product } from "../types";
import { dummyProducts } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";

const ProductPage = () => {
  // 1
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || "$";

  //2. featch id from params
  const { id } = useParams();
  const navigate = useNavigate();

  //3. Carts data
  const { items, addToCart, removeFromCart, updateQuantity } = useCart();

  //4.
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [localQuantity, setLocalQuantity] = useState(1);

  //5
  useEffect(() => {
    setLoading(true);
    setLocalQuantity(1);
    window.scrollTo(0, 0);
    const product = dummyProducts.find((p) => p._id === id); // Find the product
    setProduct(product!);
    setRelatedProducts(dummyProducts.filter((p) => p._id !== id)); // Filter product
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return <Loading />;
  }
  if (!product) {
    return null;
  }

  // If product aval
  const cartItem = items.find((item) => item.product._id === product._id);
  const inCart = !!cartItem;
  const displayQuantity = inCart ? cartItem.quantity : localQuantity;

  const categoryLabel = product.category.replace(/-/g, " ");

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Add breadcrums */}
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link to="/" className="hover:text-app-green transition-colors">
            <HomeIcon className="size-4" />
          </Link>
          <span>/</span>
          <Link
            to="/products"
            className="hover:text-app-green transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/products?category=${product.category}`}
            className="hover:text-app-green transition-colors capitalize"
          >
            {categoryLabel}
          </Link>
          <span>/</span>
          <span className="text-app-green font-medium truncate max-w-50">
            {product.name}
          </span>
        </nav>
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1.5 text-sm text-app-text-light hover:text-app-green transition-colors"
        >
          <ArrowLeftIcon className="size-4" /> Back
        </button>
        {/* Product detail section */}


        {/* Customer reviews */}



        {/* Related Products */}
      </div>
    </div>
  );
};

export default ProductPage;
