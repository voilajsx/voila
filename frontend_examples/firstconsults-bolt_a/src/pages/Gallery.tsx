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
      <section className="bg-gradient-to-br from-orange-900 to-red-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Gallery</h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed mb-8">
              A curated collection showcasing the diversity and beauty we encounter in our work around the world.
            </p>
            <button
              onClick={fetchImages}
              disabled={loading}
              className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Loading...' : 'Refresh Gallery'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-square bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square bg-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <img
                    src={image.url}
                    alt="Random dog"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                  <button
                    onClick={() => toggleLike(image.id)}
                    className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
                  >
                    <Heart
                      size={20}
                      className={likedImages.has(image.id) ? 'text-red-500 fill-current' : 'text-gray-600'}
                    />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">
                      Beautiful moments captured during our global consulting engagements
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <p className="text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Our gallery represents the diversity and joy we encounter while working with clients across different industries and cultures. Each image tells a story of partnership, discovery, and shared success.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;