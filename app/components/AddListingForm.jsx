"use client";
import { useState } from "react";

export default function AddListingForm({ onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    rooms: "1",
    description: "",
    image: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Convert price to number
    const listing = {
      ...formData,
      price: parseInt(formData.price),
    };

    onSave(listing);

    // Reset form
    setFormData({
      title: "",
      price: "",
      location: "",
      rooms: "1",
      description: "",
      image: "",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card-glass rounded-2xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Add New Listing</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., 2 Bedroom Apartment near campus"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-cyan-500 transition"
              required
            />
          </div>

          {/* Price & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Price (₦/year)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="150000"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-cyan-500 transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Akoka, Yaba"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-cyan-500 transition"
                required
              />
            </div>
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Number of Rooms
            </label>
            <select
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-cyan-500 transition"
            >
              <option value="1">1 Room</option>
              <option value="2">2 Rooms</option>
              <option value="3">3 Rooms</option>
              <option value="Shared">Shared</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the property, facilities, distance to campus..."
              rows="4"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-cyan-500 transition resize-none"
              required
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-cyan-500 transition"
              required
            />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Publish Listing
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-white/10 rounded-lg hover:bg-white/5 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
