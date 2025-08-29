import React from 'react';
import { Users, Award, Globe, Zap } from 'lucide-react';

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-900 via-orange-900 to-red-800 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-orange-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-red-400 rounded-full blur-2xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About FirstConsults</h1>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto leading-relaxed">
              Founded on the principle that every business deserves exceptional strategic guidance, we've been transforming organizations for over a decade.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                FirstConsults was born from a simple belief: that strategic consulting should be accessible, actionable, and results-driven. Our founders, with combined experience of over 50 years in management consulting, recognized the need for a more personalized approach to business transformation.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                Today, we partner with businesses of all sizes, from ambitious startups to established enterprises, helping them navigate complex challenges and unlock new opportunities for growth.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: '500+', label: 'Projects Completed' },
                  { number: '50+', label: 'Industries Served' },
                  { number: '98%', label: 'Client Satisfaction' },
                  { number: '15+', label: 'Years Experience' }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-red-200"
              >
                <div className="bg-gradient-to-r from-red-600 to-orange-600 w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <value.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600">
              Meet the experts driving our mission forward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              >
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{member.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 text-center mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium text-center mb-3">{member.role}</p>
                <p className="text-gray-600 text-center leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;