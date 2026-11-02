import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Star, Package, Search } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../../utils/mockData';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';

export const ProductListingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const products = MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Product Catalog</h1>
          <p className="text-sm text-stone-500 mt-1">
            Visual showcase of all traditional delicacies published under your store
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/shopkeeper/products/add">
            <Button variant="primary" icon={PlusCircle}>
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="w-full sm:w-80">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search products..."
        />
      </div>

      {/* Grid of Store Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 overflow-hidden">
                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {prod.category}
                </span>
                <span className="absolute top-3 right-3">
                  <Badge variant={prod.status === 'In Stock' ? 'success' : 'danger'}>
                    {prod.status}
                  </Badge>
                </span>
              </div>

              <div className="p-5">
                <h3 className="font-serif font-bold text-stone-900 text-base">{prod.name}</h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2">{prod.description}</p>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-lg font-black text-stone-900">₹{prod.price}</span>
                  <span className="text-xs text-stone-500 font-semibold">{prod.stock} units remaining</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
              <span className="text-xs text-amber-700 font-semibold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-current" /> {prod.rating} ({prod.reviews})
              </span>
              <Link to={`/shopkeeper/products/edit/${prod.id}`}>
                <Button size="sm" variant="outline" icon={Edit}>
                  Edit Item
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListingPage;
