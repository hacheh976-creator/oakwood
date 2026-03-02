import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Heart } from "lucide-react";
import { useApp } from "../../contexts/AppContext";
import { formatCurrency, formatDate } from "../../utils/format";

export default function ProductDetailScreen() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products, comments, addComment } = useApp();
  const [commentText, setCommentText] = useState("");
  const [authorName, setAuthorName] = useState("Guest");

  const product = products.find((p) => p.id === Number(productId));
  if (!product) {
    return <div className="p-4">Product not found</div>;
  }

  const productComments = comments.filter((c) => c.productId === product.id);
  const images = [product.image, ...product.gallery];
  const isLowStock = product.stock < 10;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    addComment({
      productId: product.id,
      authorName: authorName.trim() || "Guest",
      text: commentText.trim(),
    });
    setCommentText("");
  };

  return (
    <div className="min-h-screen bg-[#F5EDE3]">
      <div className="bg-[#5C3B1E] p-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-bold text-white line-clamp-1">
          {product.name}
        </h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Image Carousel */}
        <div className="h-[260px] overflow-x-auto snap-x snap-mandatory flex gap-3 scrollbar-hide">
          {images.map((url, index) => (
            <div
              key={index}
              className="min-w-full h-full rounded-[18px] overflow-hidden snap-start"
            >
              <img
                src={url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h2 className="text-xl font-extrabold text-[#5C3B1E]">
              {product.name}
            </h2>
            <button className="p-2">
              <Heart className="w-6 h-6 text-[#5C3B1E]" />
            </button>
          </div>
          <p className="text-xl font-bold text-[#5C3B1E]">
            {formatCurrency(product.price)}
          </p>
          {isLowStock && (
            <span className="inline-block px-2.5 py-1 bg-[#5C3B1E]/90 rounded-xl text-white text-xs font-semibold">
              Low Stock
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-base font-bold text-[#5C3B1E] mb-1.5">
            Description
          </h3>
          <p className="text-sm text-black/87">{product.description}</p>
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-base font-bold text-[#5C3B1E] mb-2.5">
            Comments
          </h3>
          {productComments.length === 0 ? (
            <p className="text-[13px] text-gray-600">
              No comments yet. Be the first to review this product.
            </p>
          ) : (
            <div className="space-y-2.5">
              {productComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-[14px] shadow-sm p-3 flex gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-[#5C3B1E]/90 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">
                      {comment.authorName[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#5C3B1E] text-sm">
                      {comment.authorName}
                    </p>
                    <p className="text-[13px] mt-1">{comment.text}</p>
                    <p className="text-[11px] text-gray-600 mt-1">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Comment */}
        <div className="space-y-2">
          <h3 className="text-[15px] font-semibold text-[#5C3B1E]">
            Add a comment
          </h3>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white"
          />
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Your comment"
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white resize-none"
          />
          <button
            onClick={handleAddComment}
            className="w-full bg-[#5C3B1E] text-white font-bold py-3 rounded-[14px]"
          >
            Post Comment
          </button>
        </div>
      </div>
    </div>
  );
}
