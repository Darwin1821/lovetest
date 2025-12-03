# 🌐 Siteyi Global Yapma Rehberi

Sitenizi dünyaya açmak için aşağıdaki adımları takip edin.

## 🚀 Ücretsiz Hosting Seçenekleri

### 1. **Netlify** (Önerilen - En Kolay)

#### Adımlar:
1. [Netlify.com](https://www.netlify.com) sitesine git
2. Ücretsiz hesap oluştur
3. "Add new site" → "Deploy manually" seç
4. Tüm dosyaları sürükle-bırak yap
5. Site otomatik yayınlanır!

#### Domain Bağlama:
1. Netlify dashboard'da "Domain settings" → "Add custom domain"
2. Domain adını gir (örn: sevgisorulari.com)
3. Netlify size DNS ayarlarını verir
4. Domain satın aldığın yerde (Namecheap, GoDaddy, vb.) DNS ayarlarını yap

**Avantajlar:**
- ✅ Tamamen ücretsiz
- ✅ Otomatik HTTPS (güvenli bağlantı)
- ✅ Hızlı ve güvenilir
- ✅ Kolay kullanım

---

### 2. **Vercel**

#### Adımlar:
1. [Vercel.com](https://vercel.com) sitesine git
2. GitHub ile giriş yap
3. Projeyi GitHub'a yükle
4. Vercel'de "New Project" → GitHub repo'yu seç
5. Deploy butonuna tıkla

**Avantajlar:**
- ✅ Ücretsiz
- ✅ Otomatik HTTPS
- ✅ Çok hızlı

---

### 3. **GitHub Pages**

#### Adımlar:
1. GitHub hesabı oluştur
2. Yeni repository oluştur (public)
3. Tüm dosyaları yükle
4. Settings → Pages → Source: main branch seç
5. Site yayınlanır: `kullaniciadi.github.io/repo-adi`

**Avantajlar:**
- ✅ Tamamen ücretsiz
- ✅ GitHub ile entegre

---

### 4. **Cloudflare Pages**

#### Adımlar:
1. [Cloudflare.com](https://www.cloudflare.com) hesabı oluştur
2. Pages → Create a project
3. Dosyaları yükle veya GitHub bağla
4. Deploy et

**Avantajlar:**
- ✅ Ücretsiz
- ✅ Çok hızlı CDN
- ✅ Otomatik HTTPS

---

## 🏷️ Domain Satın Alma

### Önerilen Domain Satıcıları:

1. **Namecheap** (Önerilen)
   - Fiyat: ~$10-15/yıl
   - Kolay kullanım
   - Ücretsiz WHOIS koruması

2. **GoDaddy**
   - Fiyat: ~$12-20/yıl
   - Popüler seçenek

3. **Google Domains**
   - Fiyat: ~$12/yıl
   - Basit arayüz

4. **Türkiye'den:**
   - **Turhost**
   - **Natro**
   - **Getir.com.tr** (domain satışı var)

### Domain Önerileri:
- sevgisorulari.com
- sevgilitesti.com
- asktesti.com
- sevgiliquiz.com
- askquiz.com

---

## 📋 Domain Bağlama Adımları (Netlify Örneği)

1. **Netlify'da:**
   - Site ayarları → Domain settings
   - "Add custom domain" → Domain adını gir

2. **Domain Satıcısında (Namecheap örneği):**
   - Domain listesinden domain'i seç
   - "Advanced DNS" sekmesine git
   - Aşağıdaki kayıtları ekle:
     ```
     Type: A Record
     Host: @
     Value: 75.2.60.5 (Netlify IP'si - değişebilir)
     
     Type: CNAME
     Host: www
     Value: siteniz.netlify.app
     ```

3. **Bekle:**
   - DNS yayılımı 24-48 saat sürebilir
   - Genellikle 1-2 saat içinde çalışır

---

## ⚙️ Site Ayarları

Domain aldıktan sonra `config.txt` dosyasına site URL'sini ekleyebilirsiniz:

```
siteURL=https://sevgisorulari.com
```

(Bu opsiyonel, kod zaten otomatik URL kullanıyor)

---

## 🔒 HTTPS (Güvenli Bağlantı)

Yukarıdaki hosting servisleri **otomatik olarak HTTPS** sağlar. Ekstra bir şey yapmanıza gerek yok!

---

## 📱 Mobil Uyumluluk

Site zaten responsive (mobil uyumlu) tasarlandı. Tüm cihazlarda mükemmel çalışır!

---

## 🎯 Hızlı Başlangıç (Netlify)

1. Netlify.com'a git → Ücretsiz kayıt ol
2. "Add new site" → "Deploy manually"
3. Tüm dosyaları sürükle-bırak
4. Site yayında! 🎉

**Sonraki adım:** Domain satın al ve bağla.

---

## 💡 İpuçları

- ✅ En kolay yol: **Netlify** kullan
- ✅ Domain için **Namecheap** önerilir
- ✅ DNS ayarları için hosting servisinin talimatlarını takip et
- ✅ İlk 24 saat içinde DNS yayılımı beklenebilir

---

## 🆘 Sorun mu Yaşıyorsun?

- DNS ayarlarını kontrol et
- 24-48 saat bekle (DNS yayılımı için)
- Hosting servisinin dokümantasyonuna bak
- Browser cache'ini temizle

---

**Başarılar! 🚀**

