export default function ProductsCard({ product }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                    <h2 className="text-lg font-bold mb-2">{product.name}</h2>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-teal-800 font-semibold">${product.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                </div>
        </div>
    );
}