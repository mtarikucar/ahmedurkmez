# Ahmed Ürkmez - Modern Seljuk Art Inspired Design System

Bu proje, modern Selçuklu sanatından esinlenen bir tasarım sistemi kullanarak yeniden tasarlanmıştır.

## 🎨 Renk Paleti

### Ana Renkler
- **Krem/Nötr Tonlar**: Arka plan ve temel alanlar için
  - `#f4f3e1` - Ana arka plan (açık krem)
  - `#efedd3` - İkincil arka plan (krem)
  - `#EDEACC` - Üçüncül arka plan (koyu krem)

- **Turkuaz/Teal Tonları**: Vurgular ve aksanlar için
  - `#68b4b4` - Açık turkuaz
  - `#269393` - Orta turkuaz (ana aksiyon rengi)
  - `#008080` - Koyu turkuaz

- **Bordo/Şarap Tonları**: Önemli öğeler için
  - `#b4687a` - Açık bordo/gül
  - `#932641` - Orta bordo (ikincil aksiyon)
  - `#800020` - Koyu bordo

- **Kahverengi/Toprak Tonları**: Zemin öğeleri için
  - `#7f5d4b` - Orta kahverengi
  - `#69412C` - Koyu kahverengi (ana metin)

## 🔤 Tipografi

### Ana Font: Bookmania Benzeri
- **Birincil**: Crimson Text (Google Fonts)
- **İkincil**: Libre Baskerville
- **Vurgu**: Playfair Display (başlıklar için)

### Font Sınıfları
- `.font-bookmania` - Normal ağırlık
- `.font-bookmania-medium` - Orta ağırlık (600)
- `.font-bookmania-bold` - Kalın ağırlık (700)
- `.heading-seljuk` - Başlık stili
- `.heading-seljuk-large` - Büyük başlık stili

## 🧩 Bileşenler

### Butonlar
- `.btn-primary` - Ana aksiyon butonu (turkuaz)
- `.btn-secondary` - İkincil buton (bordo çerçeveli)
- Hover efektleri ve ölçek animasyonları

### Kartlar
- `.card-seljuk` - Ana kart stili
- Gradient arka plan, yumuşak gölgeler
- Hover animasyonları

### Form Elemanları
- Gradient arka planlar
- Turkuaz odak renkleri
- Yuvarlatılmış köşeler

## 🎭 Animasyonlar

### Geçiş Efektleri
- Tüm etkileşimler için 300ms süre
- Ease-in-out timing fonksiyonu
- Hover'da ölçek ve gölge değişimleri

### Yükleme Animasyonları
- Pulse efektleri
- Dönen yükleyiciler
- Staggered animasyonlar

## 🎯 Selçuklu Sanatı Öğeleri

### Dekoratif Desenler
- Geometrik nokta dizileri
- Simetrik kompozisyonlar
- Geleneksel renk kombinasyonları

### Görsel Hiyerarşi
- Merkezi düzen
- Dengeli boşluklar
- Organik geçişler

## 📱 Responsive Tasarım

### Breakpoint'ler
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Adaptif Özellikler
- Esnek grid sistemleri
- Ölçeklenebilir tipografi
- Dokunmatik dostu etkileşimler

## ♿ Erişilebilirlik

### Renk Kontrastı
- WCAG 2.1 AA standartlarına uygun
- Yeterli kontrast oranları
- Renk körü dostu palet

### Klavye Navigasyonu
- Focus göstergeleri
- Tab sırası optimizasyonu
- Ekran okuyucu desteği

## 🛠️ Kullanım

### CSS Değişkenleri
```css
:root {
  --bg-primary: #f4f3e1;
  --teal-medium: #269393;
  --burgundy-medium: #932641;
  --brown-dark: #69412C;
  /* ... diğer değişkenler */
}
```

### Utility Sınıfları
```html
<div class="card-seljuk">
  <h2 class="heading-seljuk">Başlık</h2>
  <button class="btn-primary">Aksiyon</button>
</div>
```

## 🎨 Tasarım Prensipleri

1. **Geleneksel Modern Sentez**: Selçuklu sanatının zamansız öğelerini modern web tasarımıyla birleştirme
2. **Görsel Denge**: Simetri ve asimetri arasında denge
3. **Renk Uyumu**: Doğal ve organik renk geçişleri
4. **Tipografik Hiyerarşi**: Net ve okunabilir metin düzeni
5. **Etkileşim Zenginliği**: Kullanıcı deneyimini artıran animasyonlar

Bu tasarım sistemi, Ahmed Ürkmez'in akademik kimliğini modern Selçuklu sanatının estetik değerleriyle harmanlayarak benzersiz bir dijital deneyim sunar.
