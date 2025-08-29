import React, { useState, useEffect } from 'react';
import { RefreshCw, Heart } from 'lucide-react';

interface DogImage {
  url: string;
  id: number;
}

const Gallery = () => {
  const [images, setImages] = useState<DogImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedImages, setLikedImages] = useState<Set<number>>(new Set());

  const fetchImages = async () => {
    setLoading(true);
    try {
      const imagePromises = Array.from({ length: 6 }, async (_, index) => {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        return { url: data.message, id: Date.now() + index };
      });

      const newImages = await Promise.all(imagePromises);
      setImages(newImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const toggleLike = (imageId: number) => {
    setLikedImages(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(imageId)) {
        newLiked.delete(imageId);
      } else {
        newLiked.add(imageId);
      }
      return newLiked;
    });
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-orange-600 to-red-700 text-white py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">Our Gallery</h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed mb-12 font-light">
              A curated collection showcasing the diversity and beauty we encounter in our work around the world.
            </p>
            <button
              onClick={fetchImages}
              disabled={loading}
              className="bg-white text-red-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl inline-flex items-center space-x-3 disabled:opacity-50 text-lg"
            >
              <RefreshCw size={22} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
              <span>{loading ? 'Loading...' : 'Refresh Gallery'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-24 bg-gradient-to-br from-white to-orange-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-red-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-square bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl animate-pulse shadow-lg" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square bg-gradient-to-br from-red-100 to-orange-100 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 hover:rotate-1 border border-red-200"
                >
                  <img
                    src={image.url}
                    alt="Random dog"
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/0 via-transparent to-orange-900/0 group-hover:from-red-900/30 group-hover:to-orange-900/30 transition-all duration-500" />
                  <button
                    onClick={() => toggleLike(image.id)}
                    className="absolute top-6 right-6 bg-white/90 hover:bg-white p-3 rounded-full shadow-xl transition-all duration-300 transform hover:scale-125 hover:-translate-y-1 backdrop-blur-sm"
                  >
                    <Heart
                      size={22}
                      className={likedImages.has(image.id) ? 'text-red-500 fill-current' : 'text-gray-600'}
                    />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-900/90 via-orange-900/60 to-transparent p-8 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-white font-medium text-lg">
                      Beautiful moments captured during our global consulting engagements
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16 relative z-10">
            <p className="text-gray-700 leading-relaxed max-w-3xl mx-auto text-lg font-light">
              Our gallery represents the diversity and joy we encounter while working with clients across different industries and cultures. Each image tells a story of partnership, discovery, and shared success.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;