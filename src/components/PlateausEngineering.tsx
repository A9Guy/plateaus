
import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Cog, Settings, Users, Award, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const PlateausEngineering = () => {
  const services = [
    {
      icon: <Cog className="h-8 w-8 text-blue-600" />,
      title: "Custom Software Development",
      description: "Tailored software solutions for your business needs",
      features: ["Web Applications", "Mobile Apps", "Desktop Software", "API Development"]
    },
    {
      icon: <Settings className="h-8 w-8 text-green-600" />,
      title: "System Integration",
      description: "Seamlessly connect your existing systems",
      features: ["ERP Integration", "CRM Solutions", "Database Migration", "Cloud Services"]
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: "Technical Consulting",
      description: "Expert guidance for your technology decisions",
      features: ["Architecture Design", "Technology Stack Selection", "Performance Optimization", "Security Audits"]
    },
    {
      icon: <Award className="h-8 w-8 text-orange-600" />,
      title: "Quality Assurance",
      description: "Ensuring your software meets the highest standards",
      features: ["Automated Testing", "Manual Testing", "Performance Testing", "Security Testing"]
    }
  ];

  const projects = [
    {
      title: "E-commerce Platform",
      description: "Built a scalable marketplace platform serving 10,000+ users",
      tech: ["React", "Node.js", "PostgreSQL", "AWS"],
      status: "Completed"
    },
    {
      title: "Inventory Management System",
      description: "Custom inventory solution for manufacturing company",
      tech: ["Vue.js", "Python", "MongoDB", "Docker"],
      status: "In Progress"
    },
    {
      title: "Mobile Banking App",
      description: "Secure mobile application for financial services",
      tech: ["React Native", "Java", "MySQL", "Azure"],
      status: "Completed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <Wrench className="h-12 w-12 mr-4" />
              <h1 className="text-5xl font-bold">PLATEAUS Engineering</h1>
            </div>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Custom engineering solutions that elevate your business to new heights. 
              From concept to deployment, we build technology that works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Free Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Portfolio
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Services Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-4">Our Services</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            We provide comprehensive engineering services to help businesses leverage technology effectively
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {service.icon}
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Featured Projects */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-bold text-center mb-4">Featured Projects</h2>
          <p className="text-gray-600 text-center mb-12">
            See how we've helped businesses transform their operations through technology
          </p>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="h-full bg-white shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Why Choose Us */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-3xl p-12">
            <h2 className="text-4xl font-bold text-center mb-8">Why Choose PLATEAUS Engineering?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
                <p className="text-blue-100">10+ years of combined experience in software engineering</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
                <p className="text-blue-100">Rigorous testing and quality control processes</p>
              </div>
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Client-Focused</h3>
                <p className="text-blue-100">Dedicated support and ongoing maintenance</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Contact CTA */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help you build the perfect solution for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline">
              Download Brochure
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default PlateausEngineering;
