import React from 'react';
import { BarChart3, Cog, Users, Lightbulb, ArrowRight } from 'lucide-react';

const Services = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-orange-600 to-red-700 text-white py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">Our Services</h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed font-light">
              Comprehensive consulting solutions tailored to your unique business challenges and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-gradient-to-br from-white to-red-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-48 h-48 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-200/30 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            {[
              {
                icon: BarChart3,
                title: 'Strategic Planning',
                description: 'Develop comprehensive business strategies that align with your vision and market opportunities.',
                features: ['Market Analysis', 'Competitive Intelligence', 'Growth Roadmaps', 'Risk Assessment']
              },
              {
                icon: Cog,
                title: 'Operational Excellence',
                description: 'Optimize your operations to improve efficiency, reduce costs, and enhance customer satisfaction.',
                features: ['Process Optimization', 'Performance Metrics', 'Supply Chain Management', 'Quality Systems']
              },
              {
                icon: Users,
                title: 'Organizational Development',
                description: 'Build high-performing teams and cultures that drive sustainable business success.',
                features: ['Change Management', 'Leadership Development', 'Team Building', 'Culture Transformation']
              },
              {
                icon: Lightbulb,
                title: 'Digital Transformation',
                description: 'Navigate the digital landscape with strategies that leverage technology for competitive advantage.',
                features: ['Technology Strategy', 'Digital Innovation', 'Automation Solutions', 'Data Analytics']
              }
            ].map((service, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm p-10 rounded-3xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-red-100 hover:border-red-300 hover:bg-white"
              >
                <div className="flex items-start space-x-8">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed font-light text-lg">{service.description}</p>
                    <ul className="space-y-3">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-3 text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                          <ArrowRight size={16} className="text-red-500 group-hover:translate-x-1 transition-transform duration-300" />
                          <span className="font-medium">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gradient-to-br from-red-50 to-orange-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Our Process</h2>
            <p className="text-xl text-gray-700 font-light leading-relaxed">
              A proven methodology that ensures successful outcomes for every engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {[
              { step: '01', title: 'Discover', description: 'Deep dive into your business to understand challenges and opportunities' },
              { step: '02', title: 'Analyze', description: 'Comprehensive analysis using industry-leading frameworks and methodologies' },
              { step: '03', title: 'Design', description: 'Develop tailored solutions that align with your strategic objectives' },
              { step: '04', title: 'Deliver', description: 'Implement solutions with ongoing support to ensure lasting success' }
            ].map((phase, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-r from-red-500 to-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl">
                  <span className="text-xl font-black text-white">{phase.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{phase.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;