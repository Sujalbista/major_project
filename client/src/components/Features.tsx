import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Brush, Clock, Layers, PenTool, Image } from "lucide-react";

const FeatureShowcase = () => {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-blue-400" />,
      title: "AI-Powered Visualization",
      description:
        "Transform sketches into realistic fashion designs using our advanced AI technology",
    },
    {
      icon: <PenTool className="h-8 w-8 text-blue-400" />,
      title: "Sketch to Reality",
      description:
        "Upload your fashion sketches and see them come to life with realistic textures and details",
    },
    {
      icon: <Brush className="h-8 w-8 text-blue-400" />,
      title: "Customization",
      description:
        "Describe your vision in detail and see it implemented in your design",
    },
    {
      icon: <Layers className="h-8 w-8 text-blue-400" />,
      title: "Multiple Variations",
      description:
        "Generate different versions of your designs to explore options",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-400" />,
      title: "Design History",
      description:
        "Keep track of all your design iterations in your personal logs",
    },
    {
      icon: <Image className="h-8 w-8 text-blue-400" />,
      title: "High-Quality Output",
      description:
        "Get high-resolution images ready for presentations or production",
    },
  ];

  return (
    <div className="py-16 bg-gray-800/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">
          Platform Features
        </h2>
        <p className="text-gray-300 text-center mb-12 max-w-2xl mx-auto">
          Our powerful tools help you bring your fashion ideas to life with just
          a few clicks
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-800/80 border-gray-700 hover:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              <CardContent className="p-6">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-200">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeatureShowcase;
