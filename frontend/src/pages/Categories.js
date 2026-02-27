import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { createCategory, fetchCategories } from '../redux/slices/categorySlice';
import { categoryAPI } from '../api/axios';

const Categories = () => {
  const dispatch = useDispatch();
  const { data: categories, loading } = useSelector((state) => state.categories);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '📁',
    color: '#3B82F6',
    type: 'both',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createCategory(formData));
    if (result.payload?.category) {
      toast.success('Category created successfully');
      setFormData({
        name: '',
        description: '',
        icon: '📁',
        color: '#3B82F6',
        type: 'both',
      });
      setShowForm(false);
    } else {
      toast.error('Failed to create category');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(id);
        toast.success('Category deleted successfully');
        dispatch(fetchCategories());
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const customCategories = categories.filter((cat) => !cat.isDefault);
  const defaultCategories = categories.filter((cat) => cat.isDefault);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Category</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2">Category Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Groceries"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Icon</label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 text-2xl"
                maxLength="2"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Color</label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
                <option value="both">Both</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Optional category description"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                rows="2"
              />
            </div>

            <button
              type="submit"
              className="md:col-span-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 font-semibold"
            >
              Create Category
            </button>
          </form>
        </div>
      )}

      {/* Custom Categories */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">My Categories</h2>
        {customCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center text-gray-500">
            No custom categories yet. Create one to get started!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{category.icon}</span>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span
                    className="inline-block w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {category.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Default Categories */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Default Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {defaultCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-lg shadow-lg p-6 opacity-75">
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl">{category.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">{category.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
              <div className="flex items-center justify-between">
                <span
                  className="inline-block w-4 h-4 rounded-full"
                  style={{ backgroundColor: category.color }}
                ></span>
                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                  {category.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
