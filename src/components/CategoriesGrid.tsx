
import React from 'react';
import { Smartphone, Shirt, Heart, Home, Coffee, Dumbbell, Baby, Car, Gamepad2, PawPrint, Armchair, Briefcase, Book, Wrench } from 'lucide-react';

const categories = [
  { name: 'Electronics', icon: Smartphone, color: 'bg-blue-100', count: '1,234 items' },
  { name: 'Fashion', icon: Shirt, color: 'bg-pink-100', count: '2,456 items' },
  { name: 'Beauty', icon: Heart, color: 'bg-red-100', count: '897 items' },
  { name: 'Home & Kitchen', icon: Home, color: 'bg-green-100', count: '1,567 items' },
  { name: 'Food & Beverages', icon: Coffee, color: 'bg-orange-100', count: '678 items' },
  { name: 'Health & Wellness', icon: Dumbbell, color: 'bg-purple-100', count: '432 items' },
  { name: 'Baby Products', icon: Baby, color: 'bg-yellow-100', count: '298 items' },
  { name: 'Auto Parts', icon: Car, color: 'bg-gray-100', count: '567 items' },
  { name: 'Toys & Games', icon: Gamepad2, color: 'bg-indigo-100', count: '789 items' },
  { name: 'Pet Supplies', icon: PawPrint, color: 'bg-teal-100', count: '234 items' },
  { name: 'Furniture', icon: Armchair, color: 'bg-brown-100', count: '345 items' },
  { name: 'Office Supplies', icon: Briefcase, color: 'bg-slate-100', count: '456 items' },
  { name: 'Books', icon: Book, color: 'bg-amber-100', count: '1,123 items' },
  { name: 'PLATEAUS Engineering', icon: Wrench, color: 'bg-cyan-100', count: '89 items' },
];

const CategoriesGrid = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-lg">
            Find what you're looking for in our diverse product categories
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="group cursor-pointer bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`${category.color} rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className="h-8 w-8 text-gray-700" />
              </div>
              <h3 className="font-semibold text-black mb-2 text-sm">{category.name}</h3>
              <p className="text-xs text-gray-500">{category.count}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesGrid;
