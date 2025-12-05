import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostById } from '../services/api';
import { FabricCanvas } from '../components/canvas/FabricCanvas';
import type { DesignResult } from '../types/design';

export const SharedDesign: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [design, setDesign] = useState<DesignResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPost = async () => {
            if (!id) return;
            try {
                const post = await getPostById(id);
                setDesign(post.elementsJson);
            } catch (err) {
                console.error('Failed to load post:', err);
                setError('Failed to load design');
            } finally {
                setLoading(false);
            }
        };
        loadPost();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (error || !design) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 mb-4">{error || 'Design not found'}</p>
                    <Link to="/" className="text-blue-400 hover:text-blue-300">Go Home</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <nav className="flex justify-between items-center mb-12">
                <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    AI Design Platform
                </Link>
                <Link to="/design" className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:shadow-lg transition-all">
                    Create Your Own
                </Link>
            </nav>

            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center">Shared Design</h1>
                <FabricCanvas initialDesign={design} />
            </div>
        </div>
    );
};
