"use client";

import Link from 'next/link';
import { FiArrowRight, FiCalendar, FiUser } from 'react-icons/fi';

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Heart Health: Tips for a Strong Cardiovascular System',
    excerpt: 'Learn about the latest research on heart health and discover practical tips to maintain a healthy cardiovascular system.',
    category: 'Cardiology',
    author: 'Dr. Jennifer Wilson',
    date: 'May 15, 2023',
    image: '/blog/blog-1.jpg', // We would use real images here
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'Managing Diabetes: A Comprehensive Guide for Patients',
    excerpt: 'A detailed guide on managing diabetes effectively through diet, exercise, medication, and regular monitoring.',
    category: 'Endocrinology',
    author: 'Dr. Michael Chen',
    date: 'April 28, 2023',
    image: '/blog/blog-2.jpg',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Childhood Vaccines: What Parents Need to Know',
    excerpt: 'Essential information about childhood vaccines, their importance, safety, and the recommended vaccination schedule.',
    category: 'Pediatrics',
    author: 'Dr. Maria Garcia',
    date: 'April 12, 2023',
    image: '/blog/blog-3.jpg',
    readTime: '6 min read',
  },
];

const BlogPreview = () => {
  return (
    <section className="py-16 bg-blue-50">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl mb-6 md:mb-0">
            <h2 className="section-heading">Health Articles & Tips</h2>
            <p className="text-lg text-text-light">
              Stay informed with the latest medical research, health tips, and wellness advice from our experts.
            </p>
          </div>
          <Link href="/blog" className="flex items-center text-primary font-semibold group">
            View All Articles
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.id}`} key={post.id}>
              <div className="card hover:-translate-y-1 cursor-pointer h-full flex flex-col overflow-hidden">
                {/* Blog Image */}
                <div className="mb-4 h-48 bg-gray-200 rounded-lg overflow-hidden">
                  {/* We'd use real images here with Next.js Image component */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                    <span className="text-white font-medium">Article Image</span>
                  </div>
                </div>
                
                {/* Category Tag */}
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 text-xs rounded-full bg-blue-100 text-primary font-medium">
                    {post.category}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-semibold text-text-dark mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-text-light mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  {/* Meta */}
                  <div className="mt-auto flex text-sm text-text-light">
                    <div className="flex items-center mr-4">
                      <FiUser className="mr-1" size={14} />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <FiCalendar className="mr-1" size={14} />
                      {post.date}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview; 