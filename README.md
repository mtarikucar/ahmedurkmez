# Ahmed Urkmez Full-Stack Application

Bu proje Next.js, Nest.js ve PostgreSQL kullanarak oluşturulmuş tam kapsamlı bir TypeScript uygulamasıdır.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Nest.js with TypeScript  
- **Database**: PostgreSQL with TypeORM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

## 📁 Proje Yapısı

```
ahmedurkmez/
├── apps/
│   ├── client/          # Next.js frontend uygulaması
│   └── server/          # Nest.js backend uygulaması
├── docker/              # Docker konfigürasyonları
├── libs/                # Paylaşılan kütüphaneler (gelecekte)
└── docker-compose.yml   # PostgreSQL ve pgAdmin
```

## 🛠️ Kurulum

### 1. Veritabanını Başlatın

```bash
# PostgreSQL ve pgAdmin'i Docker ile başlatın
docker-compose up -d
```

### 2. Backend Sunucusunu Başlatın

```bash
cd apps/server
npm install
npm run start:dev
```

Backend sunucusu http://localhost:3001 adresinde çalışacaktır.

### 3. Frontend Uygulamasını Başlatın

```bash
cd apps/client
npm install
npm run dev
```

Frontend uygulaması http://localhost:3000 adresinde çalışacaktır.

## 🔧 Konfigürasyon

### Environment Variables

**Server (.env)**:
```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=ahmedurkmez_db
PORT=3001
NODE_ENV=development
```

**Client (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📊 Veritabanı Yönetimi

- **pgAdmin**: http://localhost:5050
  - Email: admin@admin.com
  - Password: admin

## 🔗 API Endpoints

### Users
- `GET /users` - Tüm kullanıcıları listele
- `GET /users/:id` - Belirli bir kullanıcıyı getir
- `POST /users` - Yeni kullanıcı oluştur
- `PATCH /users/:id` - Kullanıcıyı güncelle
- `DELETE /users/:id` - Kullanıcıyı sil

## 🚀 Geliştirme

### Backend Geliştirme
```bash
cd apps/server
npm run start:dev    # Development mode
npm run build        # Production build
npm run test         # Run tests
```

### Frontend Geliştirme
```bash
cd apps/client
npm run dev          # Development mode
npm run build        # Production build
npm run start        # Start production server
```

## 📝 Özellikler

- ✅ TypeScript desteği
- ✅ PostgreSQL veritabanı entegrasyonu
- ✅ TypeORM ile ORM desteği
- ✅ CORS konfigürasyonu
- ✅ Environment-based konfigürasyon
- ✅ Responsive tasarım (Tailwind CSS)
- ✅ API interceptors (authentication için hazır)
- ✅ Docker ile kolay veritabanı kurulumu

## 🔮 Gelecek Özellikler

- [ ] Authentication & Authorization (JWT)
- [ ] User registration/login
- [ ] Password hashing (bcrypt)
- [ ] Input validation (class-validator)
- [ ] API documentation (Swagger)
- [ ] Unit & Integration tests
- [ ] CI/CD pipeline
- [ ] Production Docker containers
