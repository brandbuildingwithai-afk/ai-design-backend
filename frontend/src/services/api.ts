import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const uploadBrandImages = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('images', file);
    });

    const response = await api.post('/brand/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.urls as string[];
};

export interface BrandAnalysis {
    brandName: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
    };
    fonts: {
        primary: string;
        secondary: string;
    };
    toneOfVoice: string;
    styleDescription: string;
    keywords: string[];
}

export const analyzeBrand = async (urls: string[]) => {
    const response = await api.post('/brand/analyze', { urls });
    return response.data.analysis as BrandAnalysis;
};

export const createDesign = async (prompt: string, templateId?: string) => {
    const response = await api.post('/agents/design', { prompt, templateId });
    return response.data.design;
};

export const saveBrandProfile = async (brandData: any) => {
    const response = await api.post('/brand', brandData);
    return response.data;
};

export const getTemplates = async () => {
    const response = await api.get('/templates');
    return response.data.templates;
};

export const getTemplateById = async (id: string) => {
    const response = await api.get(`/templates/${id}`);
    return response.data.template;
};

export const savePost = async (postData: any) => {
    const response = await api.post('/posts', postData);
    return response.data.post;
};

export const getUserPosts = async () => {
    const response = await api.get('/posts');
    return response.data.posts;
};

export const getPostById = async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data.post;
};

export const deletePost = async (id: string) => {
    await api.delete(`/posts/${id}`);
};
