import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Ahmed Ürkmez Hakkında
            </h1>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Edebiyat ve akademik araştırmalar alanında uzmanlaşmış bir yazar ve araştırmacı
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg mx-auto">
          <div className="mb-12">
            <div className="float-left mr-8 mb-4">
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Profil Fotoğrafı</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Akademik Geçmiş</h2>
            <p className="text-gray-700 mb-6">
              Ahmed Ürkmez, edebiyat ve kültürel çalışmalar alanında uzun yıllara dayanan 
              akademik deneyime sahip bir araştırmacıdır. Türk edebiyatı, karşılaştırmalı 
              edebiyat ve kültür çalışmaları konularında çok sayıda makale ve kitap yayımlamıştır.
            </p>
            
            <p className="text-gray-700 mb-6">
              Akademik kariyeri boyunca, modern Türk edebiyatının gelişimi, Doğu-Batı 
              kültür etkileşimi ve edebiyat sosyolojisi gibi konularda derinlemesine 
              araştırmalar yapmıştır. Çalışmaları, ulusal ve uluslararası dergilerde 
              yayımlanmış ve akademik çevrelerde geniş yankı bulmuştur.
            </p>
          </div>

          <div className="clear-both">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Araştırma Alanları</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Modern Türk Edebiyatı</li>
              <li>Karşılaştırmalı Edebiyat</li>
              <li>Kültürel Çalışmalar</li>
              <li>Edebiyat Sosyolojisi</li>
              <li>Doğu-Batı Kültür Etkileşimi</li>
              <li>Çağdaş Türk Yazını</li>
            </ul>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Yayınlar</h2>
            <p className="text-gray-700 mb-6">
              Ahmed Ürkmez'in akademik çalışmaları, hem ulusal hem de uluslararası 
              platformlarda yayımlanmaktadır. Kitapları ve makaleleri, edebiyat 
              araştırmacıları ve öğrenciler tarafından sıkça referans alınmaktadır.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Seçilmiş Kitaplar</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>"Modern Türk Edebiyatında Kültürel Dönüşümler"</li>
              <li>"Doğu ve Batı Arasında: Edebiyat ve Kimlik"</li>
              <li>"Çağdaş Türk Yazınında Toplumsal Temalar"</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Akademik Makaleler</h3>
            <p className="text-gray-700">
              Çok sayıda hakemli dergide yayımlanmış makaleleri, bu web sitesinin 
              "Makaleler" bölümünde detaylı olarak incelenebilir.
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Akademik Faaliyetler</h2>
            <p className="text-gray-700 mb-6">
              Ahmed Ürkmez, akademik yazım ve araştırma faaliyetlerinin yanı sıra, 
              çeşitli konferans ve sempozyumlarda konuşmacı olarak yer almaktadır. 
              Ayrıca, genç araştırmacıların yetişmesine katkıda bulunmak amacıyla 
              mentorluk faaliyetleri yürütmektedir.
            </p>
            
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Ulusal ve uluslararası konferanslarda bildiri sunumları</li>
              <li>Akademik dergilerde hakem görevleri</li>
              <li>Lisansüstü tez danışmanlıkları</li>
              <li>Edebiyat ve kültür konulu panel moderatörlükleri</li>
            </ul>
          </div>

          <div className="mt-12 bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">İletişim</h2>
            <p className="text-gray-700">
              Akademik işbirliği, araştırma projeleri veya diğer konularda 
              iletişim kurmak için <a href="/contact" className="text-indigo-600 hover:text-indigo-800">
              iletişim sayfasını</a> kullanabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
