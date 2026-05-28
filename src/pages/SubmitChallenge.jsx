import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Code2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function SubmitChallenge() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        language: 'React',
        difficulty: 'Medium',
        points: 100,
        tags: '',
        codePreview: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.codePreview || !user) return;
        
        setIsSubmitting(true);
        try {
            // Process tags into an array
            const tagsArray = formData.tags
                ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
                : [];

            const { error } = await supabase
                .from('challenges')
                .insert([
                    {
                        author_id: user.id,
                        title: formData.title,
                        language: formData.language,
                        difficulty: formData.difficulty,
                        points: parseInt(formData.points),
                        tags: tagsArray,
                        code_preview: formData.codePreview
                    }
                ]);

            if (error) throw error;
            
            navigate('/');
        } catch (error) {
            console.error("Error submitting challenge:", error);
            alert("Failed to submit challenge. See console for details.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Code2 size={32} color="var(--primary)" />
                    Submit Code for Review
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>Share your code snippet and let the community help you improve it.</p>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Title */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600 }}>Challenge Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g., Optimize React Re-renders"
                        required
                        style={{
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            fontFamily: 'inherit',
                            outline: 'none',
                            width: '100%'
                        }}
                    />
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 600 }}>Language</label>
                        <select
                            name="language"
                            value={formData.language}
                            onChange={handleChange}
                            style={{
                                background: 'rgba(30, 30, 35, 0.8)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                fontFamily: 'inherit',
                                outline: 'none',
                                width: '100%',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="React">React</option>
                            <option value="JavaScript">JavaScript</option>
                            <option value="Python">Python</option>
                            <option value="TypeScript">TypeScript</option>
                            <option value="Java">Java</option>
                            <option value="HTML">HTML</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 600 }}>Difficulty</label>
                        <select
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                            style={{
                                background: 'rgba(30, 30, 35, 0.8)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                fontFamily: 'inherit',
                                outline: 'none',
                                width: '100%',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontWeight: 600 }}>Reward (Points)</label>
                        <input
                            type="number"
                            name="points"
                            value={formData.points}
                            onChange={handleChange}
                            min="50" max="500" step="10"
                            style={{
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-sm)',
                                fontFamily: 'inherit',
                                outline: 'none',
                                width: '100%'
                            }}
                        />
                    </div>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600 }}>Tags (comma separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="e.g., Hooks, Performance, Refactor"
                        style={{
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            fontFamily: 'inherit',
                            outline: 'none',
                            width: '100%'
                        }}
                    />
                </div>

                {/* Code Snippet */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontWeight: 600 }}>Code Snippet *</label>
                    <div style={{
                        background: 'rgba(236, 72, 153, 0.1)',
                        borderLeft: '4px solid var(--secondary)',
                        padding: '0.75rem',
                        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                    }}>
                        <AlertCircle size={16} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '2px' }} />
                        Please remove any sensitive information or environment variables before submitting.
                    </div>
                    <textarea
                        name="codePreview"
                        value={formData.codePreview}
                        onChange={handleChange}
                        placeholder="Paste your code here..."
                        required
                        rows={10}
                        style={{
                            background: 'rgba(0,0,0,0.4)',
                            border: '1px solid var(--border-color)',
                            color: '#d4d4d8',
                            padding: '1rem',
                            borderRadius: 'var(--radius-sm)',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            outline: 'none',
                            width: '100%',
                            resize: 'vertical'
                        }}
                    />
                </div>

                {/* Submit Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="submit" disabled={isSubmitting} className="glass-button primary" style={{ padding: '0.75rem 2rem', fontSize: '1.05rem', opacity: isSubmitting ? 0.7 : 1 }}>
                        <Send size={18} /> {isSubmitting ? 'Publishing...' : 'Publish Challenge'}
                    </button>
                </div>

            </form>
        </div>
    );
}
