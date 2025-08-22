import { Link } from "react-router-dom";

const fmtUSD = new Intl.NumberFormat("es-UY", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-thumb">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          loading="lazy"
        />
      </Link>
      <div className="product-body">
        <h3 className="product-title">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="product-meta">
          <span className="price">{fmtUSD.format(product.priceUSD || 0)}</span>
          {product.category && <span className="chip">{product.category}</span>}
        </div>
        <Link className="btn" to={`/product/${product._id}`}>
          Ver detalle
        </Link>
      </div>
    </article>
  );
}
