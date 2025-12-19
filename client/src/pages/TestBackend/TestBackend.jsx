/**
 * TestBackend Component
 * 
 * Backend API'lerini test etmek için geliştirme aracı. Post, comment, user
 * ve admin endpoint'lerini test edebilir, token yönetimi yapabilir.
 * Not: Bu component sadece development ortamında kullanılmalıdır.
 */

import { useState, useEffect } from 'react';
import { CATEGORIES_ARRAY } from '../../constants/categories.js';

const API_BASE_URL = 'http://localhost:3000/api';

const TestBackend = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [routeCategories] = useState(['admin', 'auth', 'comments', 'posts', 'users']);
  const [fetchResults, setFetchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  
  // Form states
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '' });
  const [editPost, setEditPost] = useState(null);
  const [newComment, setNewComment] = useState({ text: '' });
  const [editComment, setEditComment] = useState(null);
  
  // Route test states
  const [routeTests, setRouteTests] = useState({
    admin: { method: 'GET', path: '', body: '' },
    auth: { method: 'POST', path: '/register', body: JSON.stringify({ username: '', email: '', password: '' }, null, 2) },
    comments: { method: 'POST', path: '/:postId/comments', body: JSON.stringify({ text: 'Test yorumu' }, null, 2) },
    posts: { method: 'GET', path: '', body: '' },
    users: { method: 'GET', path: '', body: '' }
  });

  useEffect(() => {
    // Token'ı localStorage'dan yükle
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setTokenInput(savedToken);
    }
    loadUserInfo();
    loadPosts();
  }, []);

  const saveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('token', tokenInput.trim());
      alert('Token kaydedildi!');
      loadUserInfo(); // User bilgilerini yeniden yükle
    } else {
      localStorage.removeItem('token');
      alert('Token silindi!');
      setUserInfo(null);
    }
  };

  useEffect(() => {
    if (selectedPost) {
      // Post'un comments array'i varsa direkt kullan, yoksa endpoint'ten yükle
      if (selectedPost.comments && Array.isArray(selectedPost.comments) && selectedPost.comments.length > 0) {
        // Eğer comment objeleri ise direkt kullan, sadece ID'ler ise endpoint'ten yükle
        if (typeof selectedPost.comments[0] === 'object' && selectedPost.comments[0].text) {
          setComments(selectedPost.comments);
        } else {
          loadComments(selectedPost._id);
        }
      } else {
        loadComments(selectedPost._id);
      }
    } else {
      setComments([]);
    }
  }, [selectedPost]);

  const loadUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUserInfo({ error: 'Token bulunamadı' });
        return;
      }
      // User bilgilerini yükle - endpoint'e göre ayarlanabilir
      const response = await fetch(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setFetchResults({ endpoint: 'GET /api/users/me', data, status: response.status });
      if (response.ok) {
        setUserInfo(data);
      }
    } catch (error) {
      setFetchResults({ endpoint: 'GET /api/users/me', error: error.message });
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/posts`);
      const data = await response.json();
      setFetchResults({ endpoint: 'GET /api/posts', data, status: response.status });
      if (response.ok) {
        setPosts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      setFetchResults({ endpoint: 'GET /api/posts', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (postId) => {
    setLoading(true);
    try {
      // Önce endpoint'i dene
      const response = await fetch(`${API_BASE_URL}/comments?postId=${postId}`);
      const data = await response.json();
      setFetchResults({ endpoint: `GET /api/comments?postId=${postId}`, data, status: response.status });
      if (response.ok && Array.isArray(data)) {
        setComments(data);
      } else {
        // Eğer endpoint yoksa, seçili post'un comments array'ini kullan
        if (selectedPost?.comments && Array.isArray(selectedPost.comments)) {
          setComments(selectedPost.comments);
        } else {
          setComments([]);
        }
      }
    } catch (error) {
      // Hata durumunda post'un comments array'ini kullan
      if (selectedPost?.comments && Array.isArray(selectedPost.comments)) {
        setComments(selectedPost.comments);
      } else {
        setComments([]);
      }
      setFetchResults({ endpoint: `GET /api/comments?postId=${postId}`, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(newPost)
      });
      const data = await response.json();
      setFetchResults({ endpoint: 'POST /api/posts', data, status: response.status });
      if (response.ok) {
        setNewPost({ title: '', content: '', category: '' });
        loadPosts();
      }
    } catch (error) {
      setFetchResults({ endpoint: 'POST /api/posts', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const updatePost = async (postId, updatedData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();
      setFetchResults({ endpoint: `PUT /api/posts/${postId}`, data, status: response.status });
      if (response.ok) {
        setEditPost(null);
        loadPosts();
        if (selectedPost?._id === postId) {
          setSelectedPost({ ...selectedPost, ...updatedData });
        }
      }
    } catch (error) {
      setFetchResults({ endpoint: `PUT /api/posts/${postId}`, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId) => {
    if (!window.confirm('Bu postu silmek istediğinize emin misiniz?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      const data = await response.json();
      setFetchResults({ endpoint: `DELETE /api/posts/${postId}`, data, status: response.status });
      if (response.ok) {
        loadPosts();
        if (selectedPost?._id === postId) {
          setSelectedPost(null);
          setComments([]);
        }
      }
    } catch (error) {
      setFetchResults({ endpoint: `DELETE /api/posts/${postId}`, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (e) => {
    e.preventDefault();
    if (!selectedPost) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments/${selectedPost._id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ text: newComment.text })
      });
      const data = await response.json();
      setFetchResults({ endpoint: `POST /api/comments/${selectedPost._id}/comments`, data, status: response.status });
      if (response.ok) {
        setNewComment({ text: '' });
        loadComments(selectedPost._id);
        loadPosts();
        // Post'u güncelle
        const updatedPost = await fetch(`${API_BASE_URL}/posts/${selectedPost._id}`).then(r => r.json());
        if (updatedPost) setSelectedPost(updatedPost);
      }
    } catch (error) {
      setFetchResults({ endpoint: `POST /api/comments/${selectedPost._id}/comments`, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (commentId, updatedData) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify(updatedData)
      });
      const data = await response.json();
      setFetchResults({ endpoint: `PUT /api/comments/${commentId}`, data, status: response.status });
      if (response.ok) {
        setEditComment(null);
        loadComments(selectedPost._id);
      }
    } catch (error) {
      setFetchResults({ endpoint: `PUT /api/comments/${commentId}`, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });
      const data = await response.json();
      setFetchResults({ endpoint: `DELETE /api/comments/${commentId}`, data, status: response.status });
      if (response.ok) {
        loadComments(selectedPost._id);
        loadPosts();
      }
    } catch (error) {
      setFetchResults({ endpoint: `DELETE /api/comments/${commentId}`, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testRoute = async (routeCategory) => {
    setLoading(true);
    try {
      const test = routeTests[routeCategory];
      // Path'in başında / yoksa ekle
      const path = test.path.startsWith('/') ? test.path : `/${test.path}`;
      const url = `${API_BASE_URL}/${routeCategory}${path}`;
      const token = localStorage.getItem('token');
      
      console.log('🔍 Test URL:', url);
      console.log('🔍 Method:', test.method);
      console.log('🔍 Token:', token ? 'Mevcut' : 'Yok');
      
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };
      
      let body = null;
      if (['POST', 'PUT', 'PATCH'].includes(test.method) && test.body) {
        try {
          body = JSON.parse(test.body);
          console.log('🔍 Body:', body);
        } catch (e) {
          setFetchResults({ 
            endpoint: `${test.method} /api/${routeCategory}${path}`, 
            error: 'Geçersiz JSON formatı: ' + e.message,
            status: 400
          });
          setLoading(false);
          return;
        }
      }
      
      const response = await fetch(url, {
        method: test.method,
        headers,
        ...(body && { body: JSON.stringify(body) })
      });
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      
      setFetchResults({ 
        endpoint: `${test.method} /api/${routeCategory}${path}`, 
        data, 
        status: response.status,
        url: url
      });
    } catch (error) {
      console.error('❌ Fetch hatası:', error);
      setFetchResults({ 
        endpoint: `${routeTests[routeCategory].method} /api/${routeCategory}${routeTests[routeCategory].path}`, 
        error: error.message,
        errorType: error.name,
        stack: error.stack,
        url: `${API_BASE_URL}/${routeCategory}${routeTests[routeCategory].path}`
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRouteTest = (routeCategory, field, value) => {
    setRouteTests(prev => ({
      ...prev,
      [routeCategory]: {
        ...prev[routeCategory],
        [field]: value
      }
    }));
  };

  return (
    <div style={styles.container}>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
      `}</style>
      
      {/* Token Girişi */}
      <div style={styles.tokenSection}>
        <h2 style={styles.sectionTitle}>🔑 JWT Token</h2>
        <div style={styles.tokenInputContainer}>
          <input
            type="text"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Backend console'dan kopyaladığınız token'ı buraya yapıştırın"
            style={styles.tokenInput}
          />
          <button onClick={saveToken} style={styles.saveTokenButton}>
            {localStorage.getItem('token') ? 'Token Güncelle' : 'Token Kaydet'}
          </button>
          {localStorage.getItem('token') && (
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                setTokenInput('');
                setUserInfo(null);
                alert('Token silindi!');
              }} 
              style={styles.clearTokenButton}
            >
              Token'ı Sil
            </button>
          )}
        </div>
        {localStorage.getItem('token') && (
          <p style={styles.tokenStatus}>✅ Token kaydedildi ve kullanılıyor</p>
        )}
      </div>
    

      {/* Post ve Yorum Bölümü */}
      <div style={styles.mainSection}>
        {/* Sol Sütun - Postlar */}
        <div style={styles.leftColumn}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Postlar</h2>
            <button onClick={loadPosts} style={styles.refreshButton}>Yenile</button>
          </div>
          
          {/* Yeni Post Formu */}
          <form onSubmit={createPost} style={styles.form}>
            <h3>Yeni Post Ekle</h3>
            <input
              type="text"
              placeholder="Başlık"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              style={styles.input}
              required
            />
            <textarea
              placeholder="İçerik"
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              style={styles.textarea}
              required
            />
            <select
              value={newPost.category}
              onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              style={styles.input}
              required
            >
              <option value="">Kategori Seçin</option>
              {CATEGORIES_ARRAY.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button type="submit" style={styles.submitButton}>Post Ekle</button>
          </form>

          {/* Post Listesi */}
          <div style={styles.listContainer}>
            {loading ? (
              <p>Yükleniyor...</p>
            ) : posts.length === 0 ? (
              <p>Henüz post yok.</p>
            ) : (
              posts.map(post => (
                <div
                  key={post._id}
                  style={{
                    ...styles.card,
                    ...(selectedPost?._id === post._id && styles.selectedCard)
                  }}
                  onClick={() => setSelectedPost(post)}
                >
                  <h3 style={styles.cardTitle}>{post.title}</h3>
                  <p style={styles.cardContent}>{post.content?.substring(0, 100)}...</p>
                  <div style={styles.cardMeta}>
                    <span style={styles.badge}>{post.category}</span>
                    <span style={styles.metaText}>
                      {post.author?.username || 'Bilinmeyen'} • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={styles.cardActions}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditPost(post);
                      }}
                      style={styles.editButton}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePost(post._id);
                      }}
                      style={styles.deleteButton}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sağ Sütun - Yorumlar */}
        <div style={styles.rightColumn}>
          <h2 style={styles.sectionTitle}>
            {selectedPost ? `Yorumlar - ${selectedPost.title}` : 'Yorumlar (Post seçin)'}
          </h2>
          
          {selectedPost && (
            <>
              {/* Yeni Yorum Formu */}
              <form onSubmit={createComment} style={styles.form}>
                <h3>Yeni Yorum Ekle</h3>
                <textarea
                  placeholder="Yorum metni"
                  value={newComment.text}
                  onChange={(e) => setNewComment({ text: e.target.value })}
                  style={styles.textarea}
                  required
                />
                <button type="submit" style={styles.submitButton}>Yorum Ekle</button>
              </form>

              {/* Yorum Listesi */}
              <div style={styles.listContainer}>
                {loading ? (
                  <p>Yükleniyor...</p>
                ) : comments.length === 0 ? (
                  <p>Henüz yorum yok.</p>
                ) : (
                  comments.map(comment => (
                    <div key={comment._id} style={styles.card}>
                      <p style={styles.cardContent}>{comment.text}</p>
                      <div style={styles.cardMeta}>
                        <span style={styles.metaText}>
                          {comment.author?.username || 'Bilinmeyen'} • {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={styles.cardActions}>
                        <button
                          onClick={() => setEditComment(comment)}
                          style={styles.editButton}
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => deleteComment(comment._id)}
                          style={styles.deleteButton}
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Düzenleme Modal'ları */}
      {editPost && (
        <div style={styles.modalOverlay} onClick={() => setEditPost(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Post Düzenle</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              updatePost(editPost._id, {
                title: editPost.title,
                content: editPost.content,
                category: editPost.category
              });
            }}>
              <input
                type="text"
                value={editPost.title}
                onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                style={styles.input}
                required
              />
              <textarea
                value={editPost.content}
                onChange={(e) => setEditPost({ ...editPost, content: e.target.value })}
                style={styles.textarea}
                required
              />
              <select
                value={editPost.category}
                onChange={(e) => setEditPost({ ...editPost, category: e.target.value })}
                style={styles.input}
                required
              >
                <option value="">Kategori Seçin</option>
                {CATEGORIES_ARRAY.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div style={styles.modalActions}>
                <button type="submit" style={styles.submitButton}>Kaydet</button>
                <button type="button" onClick={() => setEditPost(null)} style={styles.cancelButton}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editComment && (
        <div style={styles.modalOverlay} onClick={() => setEditComment(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3>Yorum Düzenle</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              updateComment(editComment._id, { text: editComment.text });
            }}>
              <textarea
                value={editComment.text}
                onChange={(e) => setEditComment({ ...editComment, text: e.target.value })}
                style={styles.textarea}
                required
              />
              <div style={styles.modalActions}>
                <button type="submit" style={styles.submitButton}>Kaydet</button>
                <button type="button" onClick={() => setEditComment(null)} style={styles.cancelButton}>İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Route Kategorileri Test Bölümü */}
      <div style={styles.categorySection}>
        <h2 style={styles.sectionTitle}>Route Kategorileri Testleri</h2>
        <div style={styles.routeGrid}>
          {routeCategories.map(routeCategory => {
            const test = routeTests[routeCategory];
            return (
              <div key={routeCategory} style={styles.routeCard}>
                <h3 style={styles.routeTitle}>/api/{routeCategory}</h3>
                <div style={styles.routeForm}>
                  <div style={styles.formRow}>
                    <label style={styles.label}>Method:</label>
                    <select
                      value={test.method}
                      onChange={(e) => updateRouteTest(routeCategory, 'method', e.target.value)}
                      style={styles.methodSelect}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="PATCH">PATCH</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  <div style={styles.formRow}>
                    <label style={styles.label}>Path:</label>
                    <input
                      type="text"
                      value={test.path}
                      onChange={(e) => updateRouteTest(routeCategory, 'path', e.target.value)}
                      placeholder={
                        routeCategory === 'comments' ? '/POST_ID_HERE/comments' :
                        routeCategory === 'posts' ? '/:id veya boş bırakın' :
                        routeCategory === 'users' ? '/:id veya /me' :
                        routeCategory === 'auth' ? '/register veya /login' :
                        '/example/:id'
                      }
                      style={styles.pathInput}
                    />
                    {routeCategory === 'comments' && test.method === 'POST' && (
                      <small style={styles.helpText}>
                        💡 Örnek: /1234567890abcdef/comments (post ID'sini sol taraftan kopyalayın)
                      </small>
                    )}
                  </div>
                  {['POST', 'PUT', 'PATCH'].includes(test.method) && (
                    <div style={styles.formRow}>
                      <label style={styles.label}>Body (JSON):</label>
                      <textarea
                        value={test.body}
                        onChange={(e) => updateRouteTest(routeCategory, 'body', e.target.value)}
                        placeholder='{"key": "value"}'
                        style={styles.bodyTextarea}
                      />
                    </div>
                  )}
                  <button
                    onClick={() => testRoute(routeCategory)}
                    style={styles.testButton}
                  >
                    Test Et
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fetch Sonuçları */}
      <div style={styles.resultsSection}>
        <h2 style={styles.sectionTitle}>Fetch Sonuçları</h2>
        {fetchResults && (
          <div style={styles.resultsContainer}>
            <div style={styles.resultsHeader}>
              <div>
                <strong>Endpoint:</strong> {fetchResults.endpoint}
                {fetchResults.url && (
                  <div style={styles.urlText}>
                    <strong>URL:</strong> {fetchResults.url}
                  </div>
                )}
              </div>
              {fetchResults.status && <span style={styles.statusBadge}>Status: {fetchResults.status}</span>}
            </div>
            <pre style={styles.jsonOutput}>
              {JSON.stringify(fetchResults.data || fetchResults.error || fetchResults, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  tokenSection: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  tokenInputContainer: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '10px'
  },
  tokenInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace'
  },
  saveTokenButton: {
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  clearTokenButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  tokenStatus: {
    margin: 0,
    color: '#4caf50',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  userInfoSection: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: '15px',
    color: '#333'
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  error: {
    color: '#d32f2f'
  },
  mainSection: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  leftColumn: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  rightColumn: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  refreshButton: {
    padding: '8px 16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  form: {
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  textarea: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical',
    fontFamily: 'inherit'
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  card: {
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: '#fff'
  },
  selectedCard: {
    borderColor: '#1976d2',
    borderWidth: '2px',
    backgroundColor: '#e3f2fd'
  },
  cardTitle: {
    marginTop: 0,
    marginBottom: '10px',
    color: '#333'
  },
  cardContent: {
    marginBottom: '10px',
    color: '#666',
    lineHeight: '1.5'
  },
  cardMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '12px'
  },
  badge: {
    padding: '4px 8px',
    backgroundColor: '#e0e0e0',
    borderRadius: '4px',
    fontSize: '11px'
  },
  metaText: {
    color: '#999'
  },
  cardActions: {
    display: 'flex',
    gap: '10px'
  },
  editButton: {
    padding: '6px 12px',
    backgroundColor: '#ff9800',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  deleteButton: {
    padding: '6px 12px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#757575',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  categorySection: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  routeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  routeCard: {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#fafafa'
  },
  routeTitle: {
    marginTop: 0,
    marginBottom: '15px',
    color: '#1976d2',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  routeForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  formRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  label: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: '#666'
  },
  methodSelect: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  pathInput: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px'
  },
  bodyTextarea: {
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '12px',
    fontFamily: 'monospace',
    minHeight: '100px',
    resize: 'vertical'
  },
  testButton: {
    padding: '10px 20px',
    backgroundColor: '#2196f3',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '5px'
  },
  helpText: {
    fontSize: '11px',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '2px'
  },
  resultsSection: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  resultsContainer: {
    marginTop: '15px'
  },
  resultsHeader: {
    marginBottom: '10px',
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'column',
    gap: '10px'
  },
  urlText: {
    marginTop: '5px',
    fontSize: '12px',
    color: '#666',
    fontFamily: 'monospace',
    wordBreak: 'break-all'
  },
  statusBadge: {
    padding: '4px 8px',
    backgroundColor: '#4caf50',
    color: '#fff',
    borderRadius: '4px',
    fontSize: '12px'
  },
  jsonOutput: {
    backgroundColor: '#263238',
    color: '#aed581',
    padding: '15px',
    borderRadius: '4px',
    overflowX: 'auto',
    fontSize: '12px',
    lineHeight: '1.5',
    maxHeight: '400px',
    overflowY: 'auto'
  }
};

export default TestBackend;

