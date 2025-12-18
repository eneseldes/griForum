// Controller kodları buraya
import Post from "../models/Post.js";
import User from "../models/User.js";

//========================
// Tüm Postları Döndür
//========================

export const getAllPosts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const posts = await Post.find(filter)
      .populate("author", "username")
      .sort({ createdAt: -1 });

    // Her post için like ve save sayısı ekle
    const postsWithCounts = posts.map((post) => ({
      ...post._doc,
      likeCount: post.likes.length,
      saveCount: post.savedBy.length,
    }));

    res.status(200).json(postsWithCounts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Gönderiler alınamadı", error: err.message });
  }
};

//=========================
// Tek Postu Döndür
//=========================

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)
      .populate("author", "username")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      });

    if (!post) return res.status(404).json({ message: "Gönderi bulunamadı" });

    res.status(200).json({
      ...post._doc,
      likeCount: post.likes.length,
      saveCount: post.savedBy.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Gönderi alınamadı", error: err.message });
  }
};

//=========================
// Ana Sayfaya 3 Kısa Post Koyar
//=========================

export const getHomePosts = async (req, res) => {
  try {
    const { viewMore } = req.query;

    let query = {
      $expr: { $lte: [{ $strLenCP: "$content" }, 150] },
    };

    let postsQuery = Post.find(query).sort({ createdAt: -1 });

    if (!viewMore) {
      // Başlangıçta sadece 3 post
      postsQuery = postsQuery.limit(3);
    }

    const posts = await postsQuery;

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      message: "Ana sayfa postları alınamadı",
      error: err.message,
    });
  }
};

//=========================
// Detay Sayfası
//=========================

export const getDetailPost = async (req, res) => {
  try {
    const DETAIL_POST_ID = "69405c5fb07845abab16545f";

    const post = await Post.findById(DETAIL_POST_ID)
      .populate("author", "username")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      });

    if (!post)
      return res.status(404).json({ message: "Detay postu bulunamadı" });

    res.status(200).json({
      ...post._doc,
      likeCount: post.likes.length,
      saveCount: post.savedBy.length,
    });
  } catch (err) {
    res.status(500).json({
      message: "Detay postu alınamadı",
      error: err.message,
    });
  }
};

//=========================
// Yeni Post Oluştur
//=========================

export const createPost = async (req, res) => {
  try {
    const { title, content, category, images } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Başlık ve içerik zorunludur" });
    }

    let imagePaths = [];

    if (images && Array.isArray(images)) {
      imagePaths = images.map((img) => `/uploads/posts/${img}`);
    }

    const newPost = await Post.create({
      title,
      content,
      category,
      images: imagePaths,
      author: req.user.id,
    });

    // Kullanıcının postlarına ekler:
    await User.findByIdAndUpdate(req.user.id, {
      $push: { myPosts: newPost._id },
    });

    res.status(201).json({
      message: "Gönderi oluşturuldu",
      post: newPost,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gönderi oluşturulamadı",
      error: err.message,
    });
  }
};

//=========================
// Post Güncelle
//=========================

export const updatePost = async (req, res) => {
  try {
    const { title, content, category, images } = req.body;

    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Gönderi bulunamadı" });

    // Sadece yazan kişinin güncellemesi için
    if (post.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Bu gönderiyi güncelleme yetkin yok" });
    }

    // Gönderilen fotoları klasöre yönlendir
    let imagePaths = post.images;

    if (images && Array.isArray(images)) {
      imagePaths = images.map((img) => `/uploads/posts/${img}`);
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.images = imagePaths;

    const updatedPost = await post.save();

    res.status(200).json({
      message: "Gönderi güncellendi",
      post: updatedPost,
    });
  } catch (err) {
    res.status(500).json({
      message: "Gönderi güncellenemedi",
      error: err.message,
    });
  }
};

//=========================
// Post Silme
//=========================

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Gönderi bulunamadı" });

    const isAuthor = post.author.toString() === req.user.id;
    const isAdmin = req.user.role === "admin";

    //Sadece yazan kişi ve adminin silebilmesi için
    if (!isAuthor && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Bu gönderiyi silme yetkin yok " });
    }

    await post.deleteOne();

    res.status(200).json({ message: "Gönderi silindi" });
  } catch (err) {
    res.status(500).json({
      message: "Gönderi silinemedi",
      error: err.message,
    });
  }
};

//=========================
// Gönderi Beğenme
//=========================

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Gönderi bulunamadı" });
    }

    const userId = req.user._id || req.user.id;
    if (!userId) {
      return res.status(401).json({ message: "Yetkilendirme gerekli." });
    }

    // post.likes undefined veya null olabilir, kontrol et
    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    // ObjectId karşılaştırması için toString() kullan
    const userIdString = userId.toString();
    const likedIndex = post.likes.findIndex(
      (id) => id && id.toString() === userIdString
    );

    if (likedIndex >= 0) {
      // Unlike - beğeniyi kaldır
      post.likes.splice(likedIndex, 1);
    } else {
      // Like - beğeniyi ekle
      post.likes.push(userId);
    }

    // Mongoose array değişikliğini işaretle
    post.markModified('likes');
    await post.save();

    res.status(200).json({
      liked: likedIndex < 0,
      likeCount: post.likes.length,
    });
  } catch (err) {
    console.error("Error liking post:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      message: "Beğeni işlemi yapılamadı",
      error: err.message,
    });
  }
};

//=========================
// Postu Kaydetme
//=========================

export const savePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) return res.status(404).json({ message: "Gönderi bulunamadı" });

    const userId = req.user.id;

    const alreadySaved = post.savedBy.includes(userId);

    if (alreadySaved) {
      //unsave
      post.savedBy = post.savedBy.filter((id) => id.toString() !== userId);
    } else {
      //save
      post.savedBy.push(userId);
    }

    await post.save();

    res.status(200).json({
      saved: !alreadySaved,
      saveCount: post.savedBy.length,
    });
  } catch (err) {
    res.status(500).json({
      message: "Kaydetme işlemi yapılamadı",
      error: err.message,
    });
  }
};
