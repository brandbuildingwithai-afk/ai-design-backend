import React, { useEffect, useState } from 'react';
import { getUserPosts, deletePost } from '../services/api';
import { Link } from 'react-router-dom';

interface Post {
    id: string;
    promptUsed: string;
    platform: string;
    elementsJson: any;
    createdAt: string;
    template?: { name: string };
}

export const Gallery: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPosts = async () => {
        try {
            const data = await getUserPosts();
            setPosts(data);
        } catch (err) {
            console.error('Failed to load posts:', err);
            setError('Failed to load gallery');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this design?')) return;
        try {
            await deletePost(id);
            setPosts(posts.filter((p) => p.id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete design');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <nav className="flex justify-between items-center mb-12">
                <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    AI Design Platform
                </Link>
                <div className="flex gap-4">
                    <Link to="/brand-setup" className="text-gray-400 hover:text-white transition-colors">
                        Brand Setup
                    </Link>
                    <Link to="/design" className="text-gray-400 hover:text-white transition-colors">
                        Design Studio
                    </Link>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Your Designs</h1>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 mb-6">
                        {error}
                    </div>
                )}

                {posts.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <p className="text-gray-500 mb-4">No designs yet</p>
                        <Link to="/design" className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:shadow-lg transition-all">
                            Create Your First Design
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden group hover:shadow-xl transition-all">
                                <div className="aspect-square bg-gray-900 flex items-center justify-center text-gray-600">
                                    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="p-4">
                                    <div className="text-xs text-gray-400 mb-2">
                                        {new Date(post.createdAt).toLocaleDateString()} • {post.template?.name || post.platform}
                                    </div>
                                    <p className="text-sm text-white line-clamp-2 mb-4">{post.promptUsed}</p>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/share/${post.id}`}
                                            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium text-center transition-colors"
                                        >
                                            View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
