import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, MessageCircle, Tag, PlusCircle, Search, UserCheck } from 'lucide-react';
import { FORO_POSTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const ForoPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(FORO_POSTS);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Desarrollo Regional');
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLike = (id) => {
    setPosts(prev => prev.map(post => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostTitle || !newPostContent) return;

    const created = {
      id: `post-${Date.now()}`,
      autor: user ? user.name : 'Ciudadano de Urabá',
      cargo: user ? user.role : 'Miembro de la Comunidad',
      avatar: user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      titulo: newPostTitle,
      contenido: newPostContent,
      categoria: newPostCategory,
      fecha: 'Ahora mismo',
      likes: 1,
      comentariosCount: 0,
      etiquetas: ['Urabá', 'Comunidad']
    };

    setPosts([created, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowModal(false);
  };

  const filteredPosts = posts.filter(p => 
    p.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contenido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 space-y-6 sm:space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-psp-orange/15 text-psp-orange text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" />
            Diálogo Comunitario & Propuestas
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Foro Social de Urabá
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Un espacio participativo para compartir convocatorias, discutir proyectos de impacto regional e intercambiar oportunidades.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-psp-cyan to-psp-teal text-slate-950 font-extrabold text-xs shadow-lg shadow-psp-cyan/20 hover:scale-105 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Crear Publicación
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar en el foro por tema o palabra clave..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-psp-cyan shadow-psp-soft"
        />
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="p-6 rounded-3xl bg-white dark:bg-psp-dark-card border border-slate-200 dark:border-slate-800 shadow-psp-soft space-y-4 hover:border-psp-cyan/40 transition-colors"
          >
            {/* Author */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.autor} className="w-10 h-10 rounded-full object-cover ring-2 ring-psp-cyan/30" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{post.autor}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{post.cargo} • <span className="text-psp-cyan">{post.fecha}</span></p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold">
                {post.categoria}
              </span>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{post.titulo}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{post.contenido}</p>
            </div>

            {/* Tags & Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {post.etiquetas.map(tag => (
                  <span key={tag} className="text-[10px] font-semibold text-psp-cyan bg-psp-cyan/10 px-2 py-0.5 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-4 text-xs font-semibold">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-psp-cyan transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.likes}</span>
                </button>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.comentariosCount} comentarios</span>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Modal for creating a post */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-psp-dark-card max-w-lg w-full rounded-3xl p-6 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Crear Nueva Publicación</h3>
            
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Título de la propuesta o tema</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Iniciativa de limpieza en playas de Turbo..."
                  value={newPostTitle}
                  onChange={(e) => setNewPostTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-psp-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                <select
                  value={newPostCategory}
                  onChange={(e) => setNewPostCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white"
                >
                  <option value="Desarrollo Regional">Desarrollo Regional</option>
                  <option value="Innovación & TIC">Innovación & TIC</option>
                  <option value="Emprendimiento Local">Emprendimiento Local</option>
                  <option value="Medio Ambiente & ODS">Medio Ambiente & ODS</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Detalle del mensaje</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe la idea, convocatoria o necesidad comunitaria..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-psp-cyan"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold"
                >
                  Publicar Tema
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ForoPage;
