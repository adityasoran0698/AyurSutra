import React, { useState } from "react";

const blogPosts = [
  {
    id: 1,
    title: "What is Panchakarma? Complete Beginner’s Guide",
    category: "Therapies",
    shortDesc:
      "Panchakarma is an Ayurvedic detox process that restores balance of body, mind, and spirit...",
    fullDesc:
      "Panchakarma is a holistic Ayurvedic detoxification therapy. It includes five main procedures – Vamana, Virechana, Basti, Nasya, and Raktamokshana. Each therapy is customized based on an individual’s dosha imbalance (Vata, Pitta, Kapha). It not only cleanses toxins but also rejuvenates tissues, boosts immunity, and improves overall wellbeing.",
    image:
      "https://images.unsplash.com/photo-1600948836101-60272e6e19ab?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    title: "Ayurvedic Diet: Foods That Heal",
    category: "Diet",
    shortDesc:
      "Discover the Ayurvedic diet principles that help in balancing doshas and improving digestion...",
    fullDesc:
      "Ayurvedic diet is based on eating foods that balance your unique dosha type. For example, Vata needs warm, nourishing foods; Pitta benefits from cooling foods; Kapha needs light and spicy meals. Eating according to the season is also an important principle in Ayurveda.",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Case Study: Panchakarma for Stress Relief",
    category: "Case Studies",
    shortDesc:
      "Read how Panchakarma therapies helped a patient overcome chronic stress and insomnia...",
    fullDesc:
      "A 35-year-old patient underwent a 10-day Panchakarma program including Abhyanga (oil massage), Shirodhara (oil pouring on forehead), and Nasya. Within two weeks, symptoms of stress, anxiety, and insomnia reduced drastically. This case highlights how Panchakarma supports mental health in addition to physical detoxification.",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07c?auto=format&fit=crop&w=800&q=80",
  },
];

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-6">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-teal-700">Ayurveda Blog</h1>
        <p className="text-lg text-slate-600 mt-2 max-w-2xl mx-auto">
          Explore articles on therapies, diet, lifestyle, and real-life case
          studies to understand Ayurveda better.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
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
              <p className="text-slate-600 mt-2">{post.shortDesc}</p>
              <button
                onClick={() => setSelectedPost(post)}
                className="mt-4 inline-block bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
              >
                Read More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Modal */}
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
            <p className="text-sm font-medium text-amber-600 mb-2">
              {selectedPost.category}
            </p>
            <p className="text-slate-700">{selectedPost.fullDesc}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
