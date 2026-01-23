# 🚀 griForum

Modern ve kullanıcı dostu bir forum uygulaması. React ve Express.js ile geliştirilmiş, MongoDB veritabanı kullanan full-stack bir web uygulaması.

## 📋 İçindekiler

- [Özellikler](#-özellikler)
- [Teknolojiler](#-teknolojiler)
- [Proje Yapısı](#-proje-yapısı)
- [Kurulum](#-kurulum)
- [Environment Variables](#-environment-variables)
- [Çalıştırma](#-çalıştırma)
- [API Endpoints](#-api-endpoints)
- [Backend Mimarisi](#-backend-mimarisi)
- [Frontend Mimarisi](#-frontend-mimarisi)
- [Katkıda Bulunma](#-katkıda-bulunma)

## ✨ Özellikler

### 🔐 Kimlik Doğrulama
- Kullanıcı kaydı ve girişi
- JWT token tabanlı authentication
- Otomatik token yönetimi
- Protected routes

### 📝 Post Yönetimi
- Zengin metin editörü (Editor.js)
- Kategori bazlı postlar
- Post oluşturma, düzenleme ve silme
- Post beğenme ve kaydetme
- Post arama ve filtreleme

### 💬 Yorum Sistemi
- Post'lara yorum yapma
- Yorum düzenleme ve silme
- Yorum beğenme

### 👤 Kullanıcı Profili
- Profil görüntüleme
- Profil güncelleme
- Kullanıcının postlarını görüntüleme
- Beğenilen postları görüntüleme

### 🛡️ Admin Paneli
- Kullanıcı yönetimi
- Rol yönetimi (user/admin)

## 🛠️ Teknolojiler

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL veritabanı
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Token authentication
- **dotenv** - Environment variable yönetimi

### Frontend
- **React 19** - UI kütüphanesi
- **Vite** - Build tool ve dev server
- **React Router** - Client-side routing
- **Editor.js** - Zengin metin editörü
- **SCSS** - CSS preprocessor
- **Framer Motion** - Animasyon kütüphanesi
- **React Icons** - İkon kütüphanesi

## 📁 Proje Yapısı

```
griForum/
├── client/                 # Frontend uygulaması
│   ├── src/
│   │   ├── api/           # API client ve endpoint tanımları
│   │   ├── components/     # React component'leri
│   │   ├── constants/     # Sabit değerler
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Sayfa component'leri
│   │   ├── services/      # API service fonksiyonları
│   │   ├── styles/        # Global SCSS dosyaları
│   │   └── utils/         # Yardımcı fonksiyonlar
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend uygulaması
│   ├── src/
│   │   ├── config/        # Konfigürasyon dosyaları
│   │   ├── constants/     # Sabit değerler
│   │   ├── controllers/   # Route controller'ları
│   │   ├── middlewares/   # Express middleware'leri
│   │   ├── models/        # Mongoose modelleri
│   │   ├── routes/        # Route tanımları
│   │   └── uploads/       # Yüklenen dosyalar
│   ├── package.json
│   └── .env               # Environment variables (oluşturulmalı)
│
└── README.md
```

## 🚀 Kurulum

### Gereksinimler

- **Node.js** (v18 veya üzeri)
- **MongoDB** (yerel kurulum veya MongoDB Atlas)
- **npm** veya **yarn**

### Adım 1: Repository'yi Klonlayın

```bash
git clone <repository-url>
cd griForum
```

### Adım 2: Backend Kurulumu

```bash
cd server
npm install
```

### Adım 3: Frontend Kurulumu

```bash
cd ../client
npm install
```

## 🔧 Environment Variables

### Backend (.env)

`server/` klasöründe `.env` dosyası oluşturun:

```env
# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017
# veya MongoDB Atlas için:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net

# JWT Secret Key (güçlü bir random string kullanın)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Server Port (opsiyonel, varsayılan: 3000)
PORT=3000
```

### Frontend

Frontend için environment variable gerekmez. API URL'i `client/src/constants/config.js` dosyasında tanımlıdır:

```javascript
export const API_BASE_URL = "http://localhost:3000/api";
```

Production'da bu değeri değiştirmeniz gerekebilir.

## ▶️ Çalıştırma

### Development Modu

#### Backend

```bash
cd server
npm run dev
```

Backend `http://localhost:3000` adresinde çalışacaktır.

#### Frontend

Yeni bir terminal açın:

```bash
cd client
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır (Vite varsayılan portu).

### Production Build

#### Frontend Build

```bash
cd client
npm run build
```

Build dosyaları `client/dist/` klasörüne oluşturulur.

#### Backend Start

```bash
cd server
npm start
```

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| POST | `/api/auth/register` | Kullanıcı kaydı | ❌ |
| POST | `/api/auth/login` | Kullanıcı girişi | ❌ |
| GET | `/api/auth/me` | Kullanıcı bilgileri | ✅ |

### Posts

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/posts` | Tüm postları listele | ❌ |
| GET | `/api/posts?category=Coding` | Kategoriye göre filtrele | ❌ |
| GET | `/api/posts?search=javascript` | Arama yap | ❌ |
| GET | `/api/posts/home` | Ana sayfa postları | ❌ |
| GET | `/api/posts/:postId` | Post detayı | ❌ |
| GET | `/api/posts/my-posts` | Kullanıcının postları | ✅ |
| GET | `/api/posts/my-liked-posts` | Beğenilen postlar | ✅ |
| POST | `/api/posts` | Yeni post oluştur | ✅ |
| PUT | `/api/posts/:postId` | Post güncelle | ✅ |
| DELETE | `/api/posts/:postId` | Post sil | ✅ |
| POST | `/api/posts/:postId/like` | Post beğen/beğenme | ✅ |
| POST | `/api/posts/:postId/save` | Post kaydet/kaydetme | ✅ |

### Comments

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/comments/:postId` | Post yorumlarını getir | ❌ |
| POST | `/api/comments/:postId` | Yorum oluştur | ✅ |
| PUT | `/api/comments/:commentId` | Yorum güncelle | ✅ |
| DELETE | `/api/comments/:commentId` | Yorum sil | ✅ |
| POST | `/api/comments/:commentId/like` | Yorum beğen/beğenme | ✅ |

### Users

| Method | Endpoint | Açıklama | Auth |
|--------|----------|----------|------|
| GET | `/api/users/me` | Kullanıcı bilgileri | ✅ |
| GET | `/api/users/stats` | Kullanıcı istatistikleri | ✅ |
| GET | `/api/users/saved` | Kaydedilen postlar | ✅ |
| PUT | `/api/users/update` | Profil güncelle | ✅ |

### Admin

| Method | Endpoint | Açıklama | Auth | Admin |
|--------|----------|----------|------|-------|
| GET | `/api/admin/users` | Tüm kullanıcıları listele | ✅ | ✅ |
| POST | `/api/admin/users/:userId/role` | Kullanıcı rolü güncelle | ✅ | ✅ |

**Not:** ✅ = Gerekli, ❌ = Gereksiz

## 🏗️ Backend Mimarisi

### MVC Pattern

Backend MVC (Model-View-Controller) pattern'i kullanır:

- **Models**: MongoDB şemaları (User, Post, Comment)
- **Controllers**: İş mantığı (authController, postController, vb.)
- **Routes**: Endpoint tanımları (authRoutes, postRoutes, vb.)

### Middleware Yapısı

1. **CORS Middleware**: Cross-origin istekleri için
2. **JSON Parser**: Request body'yi parse eder
3. **Static Files**: Upload edilen dosyaları serve eder
4. **authMiddleware**: JWT token doğrulama
5. **adminMiddleware**: Admin yetki kontrolü

### Veritabanı Yapısı

#### User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (required),
  role: String (enum: ["user", "admin"]),
  likedPosts: [ObjectId],
  savedPosts: [ObjectId],
  likedComments: [ObjectId],
  createdAt: Date
}
```

#### Post Model
```javascript
{
  title: String (required),
  content: String (required, Editor.js JSON),
  category: String (required, enum),
  images: [String],
  author: ObjectId (ref: User),
  likes: [ObjectId],
  savedBy: [ObjectId],
  comments: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

#### Comment Model
```javascript
{
  text: String (required),
  author: ObjectId (ref: User),
  post: ObjectId (ref: Post),
  likes: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Frontend Mimarisi

### Component Yapısı

- **Pages**: Ana sayfa component'leri (HomePage, PostDetailPage, vb.)
- **Components**: Yeniden kullanılabilir component'ler (Navbar, PostCard, vb.)
- **Hooks**: Custom React hooks (useAuth, usePosts, vb.)
- **Services**: API çağrıları (authService, postService, vb.)

### State Yönetimi

- **Local State**: `useState` hook'u ile component içi state
- **Custom Hooks**: Paylaşılan state ve logic için
- **Context API**: Global state için (gerekirse)

### Routing

React Router kullanılarak client-side routing yapılır:

- `/` - Ana sayfa
- `/login` - Giriş sayfası
- `/register` - Kayıt sayfası
- `/post/:postId` - Post detay sayfası
- `/create-post` - Post oluşturma sayfası
- `/edit-post/:postId` - Post düzenleme sayfası
- `/profile` - Profil sayfası
- `/admin` - Admin paneli

### API Client

Merkezi API client (`api/client.js`) tüm HTTP isteklerini yönetir:

- JWT token yönetimi
- Header oluşturma
- Error handling
- Response parsing

## 🔑 Test Kullanıcısı

Uygulama başlatıldığında otomatik olarak test kullanıcısı oluşturulur:

- **Email**: `test@test.com`
- **Username**: `testuser`
- **Password**: `test123`
- **Role**: `user`

JWT token konsola yazdırılır. Bu token'ı kullanarak direkt giriş yapabilirsiniz.

**Not:** Production ortamında bu özellik kaldırılmalıdır!

## 📝 Kategoriler

Post kategorileri:

- Coding
- Technology
- Life Style
- Travel
- Web Development

Kategoriler hem backend hem frontend'de `constants/categories.js` dosyasında tanımlıdır.

## 🐛 Sorun Giderme

### MongoDB Bağlantı Hatası

- MongoDB'nin çalıştığından emin olun
- `.env` dosyasındaki `MONGO_URI` değerini kontrol edin
- MongoDB Atlas kullanıyorsanız IP whitelist'i kontrol edin

### CORS Hatası

- Backend'in çalıştığından emin olun
- Frontend'in doğru port'ta çalıştığından emin olun
- `server/src/app.js` dosyasındaki CORS ayarlarını kontrol edin

### Token Hatası

- Token'ın süresinin dolmadığından emin olun
- `JWT_SECRET` değerinin doğru olduğundan emin olun
- localStorage'da token'ın olduğundan emin olun

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje eğitim amaçlı geliştirilmiştir.

## 👨‍💻 Geliştirici

Proje eğitici bir temele sahiptir. Tüm kodlar detaylı Türkçe yorumlarla açıklanmıştır.

---

**Not:** Bu README dosyası projenin güncel durumunu yansıtmaktadır. Güncellemeler için repository'yi takip edin.
