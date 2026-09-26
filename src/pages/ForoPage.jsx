import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  ThumbsUp, 
  MessageCircle, 
  PlusCircle, 
  Search, 
  CornerDownRight, 
  Image as ImageIcon, 
  Send, 
  X, 
  Lock, 
  LogIn
} from 'lucide-react';
import { FORO_POSTS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';

const ForoPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(FORO_POSTS);
  
  // Modal for new post creation
  const [showModal, setShowModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('Desarrollo Regional');

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Expanded comments state: { [postId]: boolean }
  const [expandedPosts, setExpandedPosts] = useState({});

  // Auth requirement modal state
  const [showAuthModal, setShowAuthModal] = useState(false);

  // New comment state per post: { [postId]: text }
  const [commentInputs, setCommentInputs] = useState({});
  // New comment image preview per post: { [postId]: dataUrl }
  const [commentImages, setCommentImages] = useState({});

  // Active reply target: { postId, commentId } | null
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyImage, setReplyImage] = useState(null);

  // Current user ID for checking single-like constraint
  const currentUserId = user ? (user.id || user.email || 'usr-current') : null;

  // Toggle expand comments
  const toggleExpandPost = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  // Helper for single-like constraint check
  const requireAuth = (callback) => {
    if (!user) {
      setShowAuthModal(true);
      return false;
    }
    if (callback) callback();
    return true;
  };

  // Single Like for Posts
  const handlePostLike = (postId) => {
    if (!requireAuth()) return;

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      const likedBy = post.likedBy || [];
      const hasLiked = likedBy.includes(currentUserId);
      
      return {
        ...post,
        likes: hasLiked ? Math.max(0, post.likes - 1) : post.likes + 1,
        likedBy: hasLiked 
          ? likedBy.filter(id => id !== currentUserId) 
          : [...likedBy, currentUserId]
      };
    }));
  };

  // Single Like for Comments
  const handleCommentLike = (postId, commentId) => {
    if (!requireAuth()) return;

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comentarios: post.comentarios.map(c => {
          if (c.id !== commentId) return c;
          const likedBy = c.likedBy || [];
          const hasLiked = likedBy.includes(currentUserId);
          return {
            ...c,
            likes: hasLiked ? Math.max(0, c.likes - 1) : c.likes + 1,
            likedBy: hasLiked ? likedBy.filter(id => id !== currentUserId) : [...likedBy, currentUserId]
          };
        })
      };
    }));
  };

  // Single Like for Replies (Sub-comments)
  const handleReplyLike = (postId, commentId, replyId) => {
    if (!requireAuth()) return;

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comentarios: post.comentarios.map(c => {
          if (c.id !== commentId) return c;
          return {
            ...c,
            respuestas: c.respuestas.map(r => {
              if (r.id !== replyId) return r;
              const likedBy = r.likedBy || [];
              const hasLiked = likedBy.includes(currentUserId);
              return {
                ...r,
                likes: hasLiked ? Math.max(0, r.likes - 1) : r.likes + 1,
                likedBy: hasLiked ? likedBy.filter(id => id !== currentUserId) : [...likedBy, currentUserId]
              };
            })
          };
        })
      };
    }));
  };

  // Handle Image Upload for Comment or Reply
  const handleFileSelect = (e, type, postId = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'comment') {
        setCommentImages(prev => ({ ...prev, [postId]: reader.result }));
      } else if (type === 'reply') {
        setReplyImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Create New Post
  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!newPostTitle || !newPostContent) return;

    const created = {
      id: `post-${Date.now()}`,
      autor: user.name,
      cargo: user.role || 'Miembro de la Comunidad',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      titulo: newPostTitle,
      contenido: newPostContent,
      categoria: newPostCategory,
      fecha: 'Ahora mismo',
      likes: 1,
      likedBy: [currentUserId],
      comentariosCount: 0,
      comentarios: [],
      etiquetas: ['Urabá', 'Comunidad']
    };

    setPosts([created, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowModal(false);
  };

  // Add Top-level Comment
  const handleAddComment = (postId) => {
    if (!requireAuth()) return;
    const text = commentInputs[postId]?.trim();
    const image = commentImages[postId];
    if (!text && !image) return;

    const newComment = {
      id: `c-${Date.now()}`,
      autor: user.name,
      cargo: user.role || 'Ciudadano de Urabá',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      fecha: 'Ahora mismo',
      contenido: text || '',
      imagenUrl: image || null,
      likes: 0,
      likedBy: [],
      respuestas: []
    };

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comentariosCount: post.comentariosCount + 1,
        comentarios: [...(post.comentarios || []), newComment]
      };
    }));

    // Clear inputs
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    setCommentImages(prev => ({ ...prev, [postId]: null }));
    
    // Ensure comments section is expanded
    setExpandedPosts(prev => ({ ...prev, [postId]: true }));
  };

  // Add Reply to Comment
  const handleAddReply = (postId, commentId) => {
    if (!requireAuth()) return;
    const text = replyText.trim();
    if (!text && !replyImage) return;

    const newReply = {
      id: `r-${Date.now()}`,
      autor: user.name,
      cargo: user.role || 'Ciudadano de Urabá',
      avatar: user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      fecha: 'Ahora mismo',
      contenido: text || '',
      imagenUrl: replyImage || null,
      likes: 0,
      likedBy: []
    };

    setPosts(prev => prev.map(post => {
      if (post.id !== postId) return post;
      return {
        ...post,
        comentariosCount: post.comentariosCount + 1,
        comentarios: post.comentarios.map(c => {
          if (c.id !== commentId) return c;
          return {
            ...c,
            respuestas: [...(c.respuestas || []), newReply]
          };
        })
      };
    }));

    // Reset reply state
    setReplyingTo(null);
    setReplyText('');
    setReplyImage(null);
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
          onClick={() => {
            if (requireAuth()) setShowModal(true);
          }}
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
        {filteredPosts.map((post) => {
          const isPostLiked = currentUserId && (post.likedBy || []).includes(currentUserId);
          const isExpanded = expandedPosts[post.id];

          return (
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
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  {post.etiquetas.map(tag => (
                    <span key={tag} className="text-[10px] font-semibold text-psp-cyan bg-psp-cyan/10 px-2 py-0.5 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  {/* Post Like Button */}
                  <button
                    onClick={() => handlePostLike(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                      isPostLiked
                        ? 'bg-psp-cyan/15 text-psp-cyan font-bold ring-1 ring-psp-cyan/40'
                        : 'text-slate-500 hover:text-psp-cyan hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                    title={isPostLiked ? "Quitar Me Gusta" : "Dar Me Gusta (1 por usuario)"}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isPostLiked ? 'fill-psp-cyan text-psp-cyan' : ''}`} />
                    <span>{post.likes} {post.likes === 1 ? 'Like' : 'Likes'}</span>
                  </button>

                  {/* Toggle Comments Button */}
                  <button
                    onClick={() => toggleExpandPost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                      isExpanded
                        ? 'bg-slate-100 dark:bg-slate-800 text-psp-cyan font-bold'
                        : 'text-slate-500 hover:text-psp-cyan hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comentariosCount} comentarios</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Comment Thread Section */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4 animate-in fade-in slide-in-from-top-1">
                  
                  {/* Top-Level Add Comment Form */}
                  {user ? (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-2">
                        <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">Añadir un comentario como <span className="text-psp-cyan">{user.name}</span></span>
                      </div>

                      <div className="relative">
                        <textarea
                          rows={2}
                          placeholder="Escribe tu comentario o propuesta..."
                          value={commentInputs[post.id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                          className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-psp-cyan resize-none"
                        />
                      </div>

                      {/* Image Preview for Comment */}
                      {commentImages[post.id] && (
                        <div className="relative inline-block">
                          <img src={commentImages[post.id]} alt="Adjunto" className="max-h-36 rounded-xl border border-slate-200 dark:border-slate-700 object-cover" />
                          <button
                            onClick={() => setCommentImages(prev => ({ ...prev, [post.id]: null }))}
                            className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-md hover:bg-rose-600 transition"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition">
                          <ImageIcon className="w-3.5 h-3.5 text-psp-cyan" />
                          <span>Adjuntar imagen/captura</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileSelect(e, 'comment', post.id)}
                            className="hidden"
                          />
                        </label>

                        <button
                          onClick={() => handleAddComment(post.id)}
                          className="px-4 py-1.5 rounded-xl bg-psp-cyan text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-psp-cyan/20 hover:scale-105 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Comentar
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Auth Banner if guest */
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-800/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-psp-cyan/20 text-psp-cyan flex items-center justify-center shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">¿Quieres participar en la conversación?</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">Inicia sesión o regístrate para comentar, responder y reaccionar.</p>
                        </div>
                      </div>
                      <Link
                        to="/ingresar"
                        className="px-4 py-2 rounded-xl bg-psp-cyan text-slate-950 text-xs font-black flex items-center justify-center gap-1.5 shrink-0 hover:scale-105 transition"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Iniciar Sesión
                      </Link>
                    </div>
                  )}

                  {/* List of Comments */}
                  <div className="space-y-4 pt-2">
                    {post.comentarios && post.comentarios.length > 0 ? (
                      post.comentarios.map((comment) => {
                        const isCommentLiked = currentUserId && (comment.likedBy || []).includes(currentUserId);
                        const isReplyingThis = replyingTo?.postId === post.id && replyingTo?.commentId === comment.id;

                        return (
                          <div key={comment.id} className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                            
                            {/* Comment Author Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <img src={comment.avatar} alt={comment.autor} className="w-8 h-8 rounded-full object-cover ring-1 ring-psp-cyan/30" />
                                <div>
                                  <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{comment.autor}</h5>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{comment.cargo} • <span className="text-psp-cyan">{comment.fecha}</span></p>
                                </div>
                              </div>
                            </div>

                            {/* Comment Text Content */}
                            {comment.contenido && (
                              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-10">
                                {comment.contenido}
                              </p>
                            )}

                            {/* Comment Image Attachment */}
                            {comment.imagenUrl && (
                              <div className="pl-10">
                                <img
                                  src={comment.imagenUrl}
                                  alt="Adjunto en comentario"
                                  className="max-h-56 rounded-xl border border-slate-200 dark:border-slate-800 object-cover shadow-sm hover:scale-[1.01] transition-transform cursor-pointer"
                                />
                              </div>
                            )}

                            {/* Comment Actions: Like & Reply */}
                            <div className="pl-10 flex items-center gap-4 text-[11px] font-semibold text-slate-500">
                              <button
                                onClick={() => handleCommentLike(post.id, comment.id)}
                                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors ${
                                  isCommentLiked 
                                    ? 'text-psp-cyan font-bold bg-psp-cyan/10' 
                                    : 'hover:text-psp-cyan hover:bg-slate-200/60 dark:hover:bg-slate-800'
                                }`}
                              >
                                <ThumbsUp className={`w-3.5 h-3.5 ${isCommentLiked ? 'fill-psp-cyan text-psp-cyan' : ''}`} />
                                <span>{comment.likes || 0}</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (requireAuth()) {
                                    if (isReplyingThis) {
                                      setReplyingTo(null);
                                    } else {
                                      setReplyingTo({ postId: post.id, commentId: comment.id });
                                      setReplyText('');
                                      setReplyImage(null);
                                    }
                                  }
                                }}
                                className="flex items-center gap-1 text-slate-500 hover:text-psp-cyan px-2.5 py-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
                              >
                                <CornerDownRight className="w-3.5 h-3.5" />
                                <span>Responder</span>
                              </button>
                            </div>

                            {/* Inline Reply Input Box */}
                            {isReplyingThis && user && (
                              <div className="ml-10 p-3 rounded-xl bg-white dark:bg-slate-900 border border-psp-cyan/40 space-y-2 animate-in fade-in">
                                <div className="flex items-center gap-2">
                                  <CornerDownRight className="w-3.5 h-3.5 text-psp-cyan" />
                                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                                    Respondiendo a <span className="text-psp-cyan">{comment.autor}</span>
                                  </span>
                                </div>
                                <textarea
                                  rows={2}
                                  placeholder="Escribe tu respuesta..."
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  className="w-full p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-psp-cyan resize-none"
                                />

                                {replyImage && (
                                  <div className="relative inline-block">
                                    <img src={replyImage} alt="Adjunto respuesta" className="max-h-28 rounded-lg border border-slate-200 dark:border-slate-700 object-cover" />
                                    <button
                                      onClick={() => setReplyImage(null)}
                                      className="absolute -top-1.5 -right-1.5 p-0.5 bg-rose-500 text-white rounded-full"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-1">
                                  <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700">
                                    <ImageIcon className="w-3 h-3 text-psp-cyan" />
                                    <span>Imagen</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleFileSelect(e, 'reply')}
                                      className="hidden"
                                    />
                                  </label>

                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setReplyingTo(null)}
                                      className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 text-[11px] font-bold text-slate-600 dark:text-slate-400"
                                    >
                                      Cancelar
                                    </button>
                                    <button
                                      onClick={() => handleAddReply(post.id, comment.id)}
                                      className="px-3.5 py-1 rounded-lg bg-psp-cyan text-slate-950 text-[11px] font-extrabold flex items-center gap-1"
                                    >
                                      <Send className="w-3 h-3" />
                                      Enviar
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Nested Replies Thread (Sub-comentarios) */}
                            {comment.respuestas && comment.respuestas.length > 0 && (
                              <div className="ml-6 sm:ml-10 pl-3 border-l-2 border-psp-cyan/30 space-y-3 mt-3">
                                {comment.respuestas.map((reply) => {
                                  const isReplyLiked = currentUserId && (reply.likedBy || []).includes(currentUserId);
                                  return (
                                    <div key={reply.id} className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800/70 space-y-2">
                                      <div className="flex items-center gap-2">
                                        <img src={reply.avatar} alt={reply.autor} className="w-6 h-6 rounded-full object-cover ring-1 ring-psp-cyan/30" />
                                        <div>
                                          <h6 className="text-[11px] font-bold text-slate-900 dark:text-white leading-none">{reply.autor}</h6>
                                          <span className="text-[9px] text-slate-400">{reply.fecha}</span>
                                        </div>
                                      </div>

                                      {reply.contenido && (
                                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
                                          {reply.contenido}
                                        </p>
                                      )}

                                      {reply.imagenUrl && (
                                        <div className="pl-8">
                                          <img
                                            src={reply.imagenUrl}
                                            alt="Adjunto respuesta"
                                            className="max-h-44 rounded-lg border border-slate-200 dark:border-slate-800 object-cover"
                                          />
                                        </div>
                                      )}

                                      <div className="pl-8 flex items-center gap-3 text-[10px] font-semibold text-slate-500">
                                        <button
                                          onClick={() => handleReplyLike(post.id, comment.id, reply.id)}
                                          className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
                                            isReplyLiked ? 'text-psp-cyan font-bold bg-psp-cyan/10' : 'hover:text-psp-cyan'
                                          }`}
                                        >
                                          <ThumbsUp className={`w-3 h-3 ${isReplyLiked ? 'fill-psp-cyan text-psp-cyan' : ''}`} />
                                          <span>{reply.likes || 0}</span>
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}

                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-3 italic">Aún no hay comentarios en esta propuesta. ¡Sé el primero en aportar!</p>
                    )}
                  </div>

                </div>
              )}

            </div>
          );
        })}
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

      {/* Modal for Unauthenticated User (Login Required) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-psp-dark-card max-w-md w-full rounded-3xl p-6 space-y-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-center relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-14 h-14 rounded-full bg-psp-cyan/15 text-psp-cyan flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Inicio de Sesión Requerido</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Para comentar, responder propuestas o reaccionar con Me Gusta en el Foro Social de Urabá debes tener una cuenta e iniciar sesión.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Link
                to="/ingresar"
                onClick={() => setShowAuthModal(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-psp-cyan to-psp-teal text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-psp-cyan/20 hover:scale-105 transition"
              >
                <LogIn className="w-4 h-4" />
                Iniciar Sesión / Registrarse
              </Link>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
              >
                Continuar explorando
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ForoPage;
