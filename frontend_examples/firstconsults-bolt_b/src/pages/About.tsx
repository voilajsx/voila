import React from 'react';
import { Users, Award, Globe, Zap } from 'lucide-react';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-600 via-orange-600 to-red-700 text-white py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-red-400/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tight">About FirstConsults</h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-4xl mx-auto leading-relaxed font-light">
              Founded on the principle that every business deserves exceptional strategic guidance, we've been transforming organizations for over a decade.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-gradient-to-br from-white to-orange-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-32 h-32 bg-red-100 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-10 w-40 h-40 bg-orange-100 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 tracking-tight">Our Story</h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed font-light">
                FirstConsults was born from a simple belief: that strategic consulting should be accessible, actionable, and results-driven. Our founders, with combined experience of over 50 years in management consulting, recognized the need for a more personalized approach to business transformation.
              </p>
              <p className="text-xl text-gray-700 leading-relaxed font-light">
                Today, we partner with businesses of all sizes, from ambitious startups to established enterprises, helping them navigate complex challenges and unlock new opportunities for growth.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-red-100 p-10 rounded-3xl shadow-2xl border border-red-100">
              <div className="grid grid-cols-2 gap-8">
                {[
                  { number: '500+', label: 'Projects Completed' },
                  { number: '50+', label: 'Industries Served' },
                  { number: '98%', label: 'Client Satisfaction' },
                  { number: '15+', label: 'Years Experience' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-black bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
                    <div className="text-sm font-semibold text-gray-700">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-red-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-red-200/30 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Our Values</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-light leading-relaxed">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {[
              {
                icon: Users,
                title: 'Collaboration',
                description: 'We work as an extension of your team, fostering open communication and shared success.'
              },
              {
                icon: Award,
                title: 'Excellence',
                description: 'We deliver nothing less than exceptional quality in every engagement.'
              },
              {
                icon: Globe,
                title: 'Innovation',
                description: 'We leverage cutting-edge methodologies and emerging technologies to solve complex challenges.'
              },
              {
                icon: Zap,
                title: 'Agility',
                description: 'We adapt quickly to changing market conditions and evolving business needs.'
              }
            ].map((value, index) => (
              <div
                key={index}
                className="group bg-white/90 backdrop-blur-sm p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-4 border border-red-100 hover:border-red-300 hover:bg-white"
              >
                <div className="bg-gradient-to-r from-red-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                  <value.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed font-light">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-10 w-48 h-48 bg-gradient-to-br from-red-100 to-orange-100 rounded-full blur-3xl opacity-60"></div>
          <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-gradient-to-br from-orange-100 to-red-100 rounded-full blur-3xl opacity-60"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">Leadership Team</h2>
            <p className="text-xl text-gray-700 font-light leading-relaxed">
              Meet the experts driving our mission forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Chief Executive Officer',
                description: 'Former McKinsey partner with 20+ years in strategy consulting across technology and healthcare sectors.'
              },
              {
                name: 'Michael Chen',
                role: 'Managing Director',
                description: 'Expert in digital transformation and operational excellence with deep expertise in manufacturing and retail.'
              },
              {
                name: 'Emily Rodriguez',
                role: 'Principal Consultant',
                description: 'Specializes in organizational change management and has led transformations for Fortune 100 companies.'
              }
            ].map((member, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-red-100 hover:border-red-200"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                  <span className="text-2xl font-black text-white">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{member.name}</h3>
                <p className="text-red-600 font-semibold text-center mb-4">{member.role}</p>
                <p className="text-gray-600 text-center leading-relaxed font-light">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;