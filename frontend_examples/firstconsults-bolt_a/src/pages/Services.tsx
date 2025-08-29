import React from 'react';
import { BarChart3, Cog, Users, Lightbulb, ArrowRight } from 'lucide-react';

const Services = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-cyan-900 to-blue-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto leading-relaxed">
              Comprehensive consulting solutions tailored to your unique business challenges and opportunities.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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
                className="group bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-6">
                  <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-3 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <service.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2 text-gray-700">
                          <ArrowRight size={16} className="text-blue-600" />
                          <span>{feature}</span>
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Process</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A proven methodology that ensures successful outcomes for every engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discover', description: 'Deep dive into your business to understand challenges and opportunities' },
              { step: '02', title: 'Analyze', description: 'Comprehensive analysis using industry-leading frameworks and methodologies' },
              { step: '03', title: 'Design', description: 'Develop tailored solutions that align with your strategic objectives' },
              { step: '04', title: 'Deliver', description: 'Implement solutions with ongoing support to ensure lasting success' }
            ].map((phase, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">{phase.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{phase.title}</h3>
                <p className="text-gray-600 leading-relaxed">{phase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;