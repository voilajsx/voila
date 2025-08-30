import { Button } from "@voilajsx/uikit/button";
import { Card, CardContent, CardHeader, CardTitle } from "@voilajsx/uikit/card";
import { 
  Target, 
  TrendingUp, 
  Cog, 
  Shield, 
  Lightbulb, 
  Users, 
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: Target,
      title: "Strategic Planning",
      description: "Comprehensive strategic planning services to define your vision, mission, and roadmap for sustainable growth.",
      features: [
        "Market analysis & competitive intelligence",
        "Strategic goal setting & KPI development", 
        "Business model optimization",
        "Long-term planning & execution roadmaps"
      ]
    },
    {
      icon: TrendingUp,
      title: "Business Transformation",
      description: "End-to-end transformation programs to modernize operations and drive organizational change.",
      features: [
        "Digital transformation initiatives",
        "Process reengineering & optimization",
        "Organizational restructuring", 
        "Change management & training"
      ]
    },
    {
      icon: Cog,
      title: "Operational Excellence",
      description: "Optimize your operations for maximum efficiency, quality, and cost-effectiveness.",
      features: [
        "Lean process implementation",
        "Supply chain optimization",
        "Quality management systems",
        "Performance metrics & dashboards"
      ]
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Comprehensive risk assessment and mitigation strategies to protect your business.",
      features: [
        "Enterprise risk assessment",
        "Compliance & regulatory guidance",
        "Business continuity planning",
        "Crisis management protocols"
      ]
    },
    {
      icon: Lightbulb,
      title: "Innovation Consulting",
      description: "Foster innovation culture and develop new products, services, and business models.",
      features: [
        "Innovation strategy development",
        "New product/service design",
        "Technology adoption planning",
        "R&D optimization"
      ]
    },
    {
      icon: Users,
      title: "Leadership Development",
      description: "Build strong leadership capabilities and high-performing teams across your organization.",
      features: [
        "Executive coaching & mentoring",
        "Leadership assessment & development",
        "Team building & collaboration",
        "Succession planning"
      ]
    }
  ];

  const packages = [
    {
      name: "Starter",
      price: "$5,000",
      duration: "1-2 months",
      description: "Perfect for small businesses looking to get strategic guidance.",
      features: [
        "Initial business assessment",
        "Strategic recommendations report",
        "2 consultation sessions",
        "Email support"
      ]
    },
    {
      name: "Professional",
      price: "$15,000",
      duration: "3-6 months", 
      description: "Comprehensive consulting for growing businesses.",
      features: [
        "Full strategic planning process",
        "Implementation roadmap",
        "Monthly progress reviews",
        "Dedicated consultant",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      duration: "6+ months",
      description: "Tailored solutions for large organizations and complex projects.",
      features: [
        "Custom consulting program",
        "Dedicated team of experts",
        "24/7 support",
        "Executive reporting",
        "Training & workshops"
      ]
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-10 left-20 w-36 h-36 bg-secondary/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-52 h-52 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto text-center animate-fade-in relative">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Comprehensive consulting solutions designed to address your unique business 
            challenges and unlock new opportunities for growth and success.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="bg-card shadow-lg hover:shadow-xl transition-all duration-500 h-full hover:scale-105 transform group">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                    <service.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Consulting Packages</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the consulting package that best fits your business needs and budget.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`relative bg-card shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 transform group ${
                  pkg.popular ? 'ring-2 ring-primary border-primary/30' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">{pkg.price}</div>
                    <div className="text-muted-foreground">{pkg.duration}</div>
                  </div>
                  
                  <p className="text-muted-foreground mb-6 text-center">
                    {pkg.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full transition-all duration-500 hover:scale-105 transform ${
                      pkg.popular 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-secondary hover:bg-secondary/90'
                    }`}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-50"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-16 left-16 w-44 h-44 bg-secondary/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-16 right-16 w-36 h-36 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let's discuss your specific needs and create a customized consulting solution 
            that drives real results for your organization.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 transition-all duration-500 text-lg px-8 py-4 hover:scale-105 transform"
          >
            Schedule Free Consultation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Services;