import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Target, Award } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-600 via-orange-600 to-red-700 text-white py-24 lg:py-40 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-orange-400/30 to-red-400/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-red-400/30 to-orange-400/30 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-orange-300/20 to-red-300/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8 tracking-tight">
              Transform Your Business
              <span className="block bg-gradient-to-r from-orange-300 to-yellow-300 bg-clip-text text-transparent mt-2">
                With Expert Consulting
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              We deliver strategic insights and innovative solutions that drive measurable growth and lasting success for forward-thinking businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/services"
                className="bg-white text-red-600 px-10 py-5 rounded-2xl font-bold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl flex items-center justify-center space-x-3 text-lg"
              >
                <span>Explore Services</span>
                <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white/80 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-red-600 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 backdrop-blur-sm text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-32 h-32 bg-red-200/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-200/30 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Why Choose FirstConsults?
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed">
              We combine deep industry expertise with innovative methodologies to deliver exceptional results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {[
              {
                icon: TrendingUp,
                title: 'Growth Strategy',
                description: 'Data-driven strategies that accelerate sustainable business growth and market expansion.'
              },
              {
                icon: Users,
                title: 'Expert Team',
                description: 'Seasoned consultants with decades of cross-industry experience and proven track records.'
              },
              {
                icon: Target,
                title: 'Proven Results',
                description: 'Consistent track record of delivering measurable outcomes and ROI for our clients.'
              },
              {
                icon: Award,
                title: 'Industry Recognition',
                description: 'Award-winning consulting firm trusted by Fortune 500 companies worldwide.'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-red-100 hover:border-red-300 hover:bg-white"
              >
                <div className="bg-gradient-to-r from-red-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-red-600 via-orange-600 to-red-700 text-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10 tracking-tight">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl md:text-2xl text-red-100 mb-12 max-w-3xl mx-auto relative z-10 font-light leading-relaxed">
            Let's discuss how our strategic consulting can help you achieve your business objectives.
          </p>
          <Link
            to="/services"
            className="bg-white text-red-600 px-12 py-6 rounded-2xl font-black hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-2xl inline-flex items-center space-x-4 relative z-10 text-lg"
          >
            <span>Get Started Today</span>
            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;