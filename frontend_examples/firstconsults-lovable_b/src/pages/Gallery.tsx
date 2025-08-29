import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DogImage {
  message: string;
  status: string;
}

const Gallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchRandomImages = async () => {
    setLoading(true);
    try {
      const promises = Array.from({ length: 6 }, () =>
        fetch('https://dog.ceo/api/breeds/image/random').then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      const imageUrls = results
        .filter((result: DogImage) => result.status === 'success')
        .map((result: DogImage) => result.message);
      
      setImages(imageUrls);
      toast({
        title: "Gallery Updated",
        description: "New random dog images have been loaded!",
      });
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        title: "Error",
        description: "Failed to load images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomImages();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-warm-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-16 left-16 w-40 h-40 bg-accent-gradient rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-16 right-16 w-56 h-56 bg-hero-gradient rounded-full blur-3xl animate-float" style={{animationDelay: '1.2s'}}></div>
        </div>
        <div className="max-w-7xl mx-auto text-center animate-fade-in relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-text-gradient bg-clip-text text-transparent animate-slide-up">
            Our Gallery
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8 animate-slide-up">
            Discover our curated collection of inspirational images that reflect 
            our commitment to excellence and creativity in every project we undertake.
          </p>
          
          <Button 
            onClick={fetchRandomImages}
            disabled={loading}
            className="bg-hero-gradient hover:shadow-glow transition-all duration-500 hover:scale-105 transform animate-slide-up"
          >
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Gallery
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="bg-card-gradient shadow-soft">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted animate-pulse rounded-lg" />
                    <div className="p-6">
                      <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                      <div className="h-3 bg-muted animate-pulse rounded w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {images.map((imageUrl, index) => (
                <Card key={index} className="group bg-card-gradient shadow-soft hover:shadow-glow transition-all duration-500 overflow-hidden hover:scale-105 transform animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                  <CardContent className="p-0">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-hero-gradient/20 transition-colors duration-500 flex items-center justify-center">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-all duration-500 bg-white/90 hover:bg-white backdrop-blur-sm hover:scale-105 transform shadow-medium"
                          onClick={() => window.open(imageUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Full Size
                        </Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 bg-text-gradient bg-clip-text text-transparent">Inspiration #{index + 1}</h3>
                      <p className="text-muted-foreground text-sm">
                        Each image represents our dedication to finding beauty and 
                        inspiration in unexpected places, just like we do with business solutions.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6 animate-slide-up">Gallery Insights</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-card-gradient shadow-soft hover:shadow-glow transition-all duration-500 hover:scale-105 transform animate-slide-up">
                <CardContent className="p-8 text-center">
                  <div className="text-4xl font-bold bg-text-gradient bg-clip-text text-transparent mb-2">{images.length}</div>
                  <div className="text-muted-foreground">Images Currently Displayed</div>
                </CardContent>
              </Card>
              <Card className="bg-card-gradient shadow-soft hover:shadow-glow transition-all duration-500 hover:scale-105 transform animate-slide-up" style={{animationDelay: '0.1s'}}>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl font-bold bg-text-gradient bg-clip-text text-transparent mb-2">∞</div>
                  <div className="text-muted-foreground">Possible Combinations</div>
                </CardContent>
              </Card>
              <Card className="bg-card-gradient shadow-soft hover:shadow-glow transition-all duration-500 hover:scale-105 transform animate-slide-up" style={{animationDelay: '0.2s'}}>
                <CardContent className="p-8 text-center">
                  <div className="text-4xl font-bold bg-text-gradient bg-clip-text text-transparent mb-2">100%</div>
                  <div className="text-muted-foreground">Randomly Generated</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-warm-gradient opacity-50"></div>
        <div className="absolute inset-0 opacity-25">
          <div className="absolute top-12 right-12 w-48 h-48 bg-accent-gradient rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-12 left-12 w-36 h-36 bg-hero-gradient rounded-full blur-3xl animate-float" style={{animationDelay: '1.8s'}}></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl font-bold mb-6 animate-slide-up">Inspired by What You See?</h2>
          <p className="text-xl text-muted-foreground mb-8 animate-slide-up">
            Just like our diverse gallery, we bring fresh perspectives and innovative 
            solutions to every consulting project. Let's create something amazing together.
          </p>
          <Button 
            size="lg" 
            className="bg-hero-gradient hover:shadow-glow transition-all duration-500 text-lg px-8 py-4 hover:scale-105 transform animate-slide-up"
          >
            Start Your Project
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Gallery;