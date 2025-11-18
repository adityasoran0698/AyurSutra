import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";

const Blog = () => {
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset } = useForm();

  // 🟢 Fetch user and blogs
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/user/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.log("User not logged in");
      }
    };

    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/blogs/all-blogs"
        );

        setBlogs(response.data.blogs || []);
      } catch (error) {
        toast.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
    fetchUser();
  }, []);

  // 🟢 Add new blog
  const handleAddBlog = async (data) => {
    try {
      const res = await axios.post(
        `http://localhost:8000/blogs/add-blogs/${user._id}`,
        data,
        {
          withCredentials: true,
        }
      );

      if (res.status === 201 || res.status === 200) {
        toast.success("Blog added successfully!");
        setShowAddModal(false);
        reset();
        // Refresh blog list
        const updatedBlogs = await axios.get(
          "http://localhost:8000/blogs/all-blogs"
        );
        setBlogs(updatedBlogs.data.blogs || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to post blog");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6 w-full">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-teal-700">Ayurveda Blog</h1>
        <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">
          Explore articles on therapies, diet, lifestyle, and real-life case
          studies to understand Ayurveda better.
        </p>

        {/* Doctor Add Blog Button */}
        {user?.role === "doctor" && (
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-6 bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            Add Blog
          </button>
        )}
      </div>

      {/* Loading / No blogs / Blogs */}
      {loading ? (
        <div className="text-center text-slate-600 text-lg">
          Loading blogs...
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center text-slate-600 text-lg">
          No blogs available yet.{" "}
          {user?.role === "doctor" && (
            <span className="text-amber-600 font-semibold">
              Be the first to add one!
            </span>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-lg border border-slate-200 hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="h-40 w-full object-cover"
              />
              <div className="p-6">
                <span className="text-sm font-medium text-amber-600">
                  {post.category}
                </span>
                <h2 className="text-xl font-semibold text-teal-700 mt-2">
                  {post.title}
                </h2>
                {post.doctor.fullname && (
                  <p className="text-sm text-slate-500 mt-1">
                    By {post.doctor.fullname}
                  </p>
                )}
                <p className="text-slate-600 mt-2">{post.shortDesc}</p>
                <button
                  onClick={() => setSelectedPost(post)}
                  className="mt-4 inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                >
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Modal (View Post) */}
      {selectedPost && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl w-full relative border-t-4 border-amber-600">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-teal-700 mb-4">
              {selectedPost.title}
            </h2>
            <p className="text-sm font-medium text-amber-600 mb-1">
              {selectedPost.category}
            </p>
            {selectedPost.doctorName && (
              <p className="text-slate-500 text-sm mb-2">
                Posted by Dr. {selectedPost.doctorName}
              </p>
            )}
            <p className="text-slate-700">{selectedPost.fullDesc}</p>
          </div>
        </div>
      )}

      {/* Add Blog Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-lg relative border-t-4 border-amber-600">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-700"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-teal-700 mb-4">
              Add New Blog
            </h2>

            {/* 🟢 React Hook Form */}
            <form
              onSubmit={handleSubmit(handleAddBlog)}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                placeholder="Blog Title"
                {...register("title", { required: true })}
                className="border border-slate-300 p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Category"
                {...register("category", { required: true })}
                className="border border-slate-300 p-2 rounded-lg"
              />
              <textarea
                placeholder="Short Description"
                {...register("shortDesc", { required: true })}
                className="border border-slate-300 p-2 rounded-lg"
              />
              <textarea
                placeholder="Full Description"
                {...register("fullDesc", { required: true })}
                className="border border-slate-300 p-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                {...register("image")}
                className="border border-slate-300 p-2 rounded-lg"
              />
              <button
                type="submit"
                className="bg-amber-600 text-white px-5 py-2 rounded-lg hover:bg-amber-700 transition"
              >
                Post
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
