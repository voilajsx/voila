import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Globe, Users2, Heart, ArrowRight } from "lucide-react";

const About = () => {
  const stats = [
    { number: "500+", label: "Projects Completed", icon: Award },
    { number: "50+", label: "Global Clients", icon: Globe },
    { number: "25+", label: "Expert Consultants", icon: Users2 },
    { number: "98%", label: "Client Satisfaction", icon: Heart }
  ];

  const values = [
    {
      title: "Excellence",
      description: "We strive for excellence in every project, delivering solutions that exceed expectations and drive meaningful results."
    },
    {
      title: "Innovation",
      description: "We embrace cutting-edge methodologies and technologies to solve complex business challenges with creative solutions."
    },
    {
      title: "Integrity",
      description: "We build trust through transparency, honest communication, and ethical business practices in all our engagements."
    },
    {
      title: "Collaboration",
      description: "We work closely with our clients as true partners, fostering collaborative relationships that ensure long-term success."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto text-center animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-text-gradient bg-clip-text text-transparent">
            About FirstConsults
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Founded on the principle of delivering transformative business solutions, 
            FirstConsults has been helping organizations achieve their strategic objectives 
            through expert guidance and innovative approaches.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-card-gradient shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-hero-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                To empower businesses with strategic insights and innovative solutions 
                that drive sustainable growth, operational excellence, and competitive advantage 
                in an ever-evolving marketplace.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We believe that every organization has the potential to achieve extraordinary 
                results when equipped with the right strategy, tools, and expertise. Our role 
                is to unlock that potential through collaborative partnerships and proven methodologies.
              </p>
            </div>
            <div>
              <Card className="bg-card-gradient shadow-strong">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    To be the most trusted consulting partner for businesses worldwide, 
                    known for our ability to transform challenges into opportunities 
                    and deliver measurable, lasting value.
                  </p>
                  <Button className="bg-hero-gradient hover:shadow-medium transition-all duration-300">
                    Learn About Our Process
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The principles that guide every interaction, decision, and solution we deliver.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-card-gradient shadow-soft hover:shadow-medium transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-semibold mb-4 text-primary">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Partner with Us?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Discover how FirstConsults can help transform your business challenges 
            into strategic advantages.
          </p>
          <Button 
            size="lg" 
            className="bg-hero-gradient hover:shadow-strong transition-all duration-300 text-lg px-8 py-4"
          >
            Schedule a Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;