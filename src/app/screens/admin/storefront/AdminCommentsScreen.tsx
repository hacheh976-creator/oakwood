import { useNavigate } from "react-router";
import { ArrowLeft, Trash2, User } from "lucide-react";
import { useApp } from "../../../contexts/AppContext";
import { formatDate } from "../../../utils/format";

export default function AdminCommentsScreen() {
  const navigate = useNavigate();
  const { comments, products, deleteComment } = useApp();

  const getProductName = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    return product?.name || "Unknown Product";
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      deleteComment(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#D4C4B0]">
      <div className="bg-[#F5EFE7] border-b p-4 flex items-center gap-3">
        <button onClick={() => navigate("/admin/storefront")}>
          <ArrowLeft className="w-6 h-6 text-[#2C1810]" />
        </button>
        <h1 className="text-lg sm:text-[22px] font-black text-[#2C1810]">User Comments</h1>
      </div>

      <div className="p-4 space-y-3">
        {comments.length === 0 ? (
          <div className="text-center py-12 text-black/60">
            <p className="text-sm font-semibold">No comments yet. Comments from users will appear here.</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-[#F5EFE7] rounded-[18px] border border-[#D4C4B0] shadow-sm p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-[#4A3829] flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-black text-black/87">{comment.authorName}</h3>
                      <p className="text-xs font-semibold text-black/60">
                        on {getProductName(comment.productId)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                  <p className="text-sm text-black/87 mt-2">{comment.text}</p>
                  <p className="text-xs text-black/50 mt-2">
                    {formatDate(comment.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
