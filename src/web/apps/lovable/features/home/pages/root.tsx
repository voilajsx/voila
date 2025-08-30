import { Button } from "@voilajsx/uikit/button";
import { Card, CardContent } from "@voilajsx/uikit/card";
import { ArrowRight, CheckCircle, Users, Target, TrendingUp } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Users,
      title: "Expert Team",
      description: "Our consultants bring decades of experience across industries."
    },
    {
      icon: Target,
      title: "Strategic Focus", 
      description: "Tailored solutions that align with your business objectives."
    },
    {
      icon: TrendingUp,
      title: "Proven Results",
      description: "Track record of delivering measurable business outcomes."
    }
  ];

  const benefits = [
    "Comprehensive business analysis",
    "Strategic planning & execution", 
    "Digital transformation guidance",
    "Performance optimization",
    "Risk assessment & mitigation",
    "Change management support"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-slide-up">
              Transform Your Business
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up">
              FirstConsults delivers strategic expertise and innovative solutions 
              to accelerate your business growth and competitive advantage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 transition-all duration-500 text-lg px-8 py-4 hover:scale-105 transform"
              >
                Start Consultation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-primary/30 hover:border-primary hover:bg-primary/5">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 animate-slide-up">Why Choose FirstConsults</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up">
              We combine industry expertise with innovative methodologies to deliver exceptional results.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 transform">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Comprehensive Services</h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                From strategy development to implementation, we provide end-to-end 
                consulting solutions tailored to your unique business needs.
              </p>
              
              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Button className="mt-8 bg-primary hover:bg-primary/90 transition-all duration-500 hover:scale-105 transform">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="lg:pl-8">
              <Card className="bg-card shadow-lg border border-primary/20 hover:border-primary/40 transition-all duration-500">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Ready to Get Started?</h3>
                  <p className="text-muted-foreground mb-6">
                    Schedule a free consultation to discuss your business challenges 
                    and discover how we can help you achieve your goals.
                  </p>
                  <Button className="w-full bg-primary hover:bg-primary/90 transition-all duration-500 hover:scale-105 transform">
                    Book Free Consultation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;