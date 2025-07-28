import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Users, Lock, Eye, Database, UserCheck, Globe, Mail, Server, Key, HardDrive, Settings, Building2, Gavel, AlertTriangle } from "lucide-react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-emerald-50 dark:from-gray-900 dark:via-teal-900 dark:to-emerald-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#137775]/20 to-emerald-600/20 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#137775] rounded-full mb-6 animate-pulse">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#137775] to-emerald-600 bg-clip-text text-transparent mb-4">
              Terms and Conditions
            </h1>
            <h2 className="text-2xl font-semibold text-[#137775] mb-4">
              Intego360: Government Cross-Sectoral Coordination Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ethical governance framework for Rwanda's local government digital transformation
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 pb-16">
        {/* Government Ethics Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Government Data Ethics Framework
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[#137775] to-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-12">
            <Card className="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-[#137775] to-teal-600 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Government Official Consent & Participation
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  All government officials participate voluntarily with comprehensive understanding of Intego360's cross-sectoral coordination objectives. Clear documentation of platform capabilities and data requirements is provided to all System Administrators, Sector Coordinators, and District Administrators.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Government personnel may discontinue platform usage or restrict data access at any time without affecting their professional responsibilities, ensuring participation is based on informed understanding of the system's governance enhancement goals.
                </p>
              </CardContent>
            </Card>

            <Card className="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Government Data Privacy & Security
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We maintain the highest standards of government data protection across agriculture, health, and education sectors. Only essential sectoral coordination data is collected, with comprehensive encryption and access controls protecting sensitive government information.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  All data analysis is conducted through aggregated metrics and performance indicators, preventing identification of individual citizens or communities. Government data is stored within Rwanda's digital infrastructure with restricted access limited to authorized personnel only.
                </p>
              </CardContent>
            </Card>

            <Card className="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-[#137775] rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Local Government Capacity & Digital Inclusion
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Intego360 serves government officials across diverse technical expertise levels, from urban district administrators to rural sector coordinators. The platform accommodates varying digital literacy through progressive interface complexity and comprehensive training materials.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Multi-language support (English, Kinyarwanda) ensures equitable access across Rwanda's linguistic diversity. The system provides equal functionality regardless of geographic location, preventing digital divides between urban and rural government operations.
                </p>
              </CardContent>
            </Card>

            <Card className="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                    <Gavel className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Rwanda Government Ethics & Legal Compliance
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  This platform fully complies with Rwanda's digital governance standards, data protection laws, and public sector ethics requirements. All development and deployment processes have been reviewed and approved by institutional supervisors and government stakeholders.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  The system upholds principles of transparency, accountability, and public service excellence as mandated by Rwanda's governance framework, ensuring all AI-powered recommendations support evidence-based decision-making for improved citizen service delivery.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Government Platform Principles */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Government Platform Principles
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Foundational principles for ethical government AI and data management
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#137775] to-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Government Data Security",
                icon: Lock,
                description: "Military-grade encryption protects sensitive government data across agriculture, health, and education sectors with role-based access controls.",
                color: "from-[#137775] to-teal-600"
              },
              {
                title: "AI Transparency",
                icon: Eye,
                description: "All AI-powered recommendations include clear explanations, confidence scores, and decision rationale for government accountability.",
                color: "from-emerald-500 to-teal-600"
              },
              {
                title: "Cross-Sectoral Integration",
                icon: Database,
                description: "Seamless data integration across government sectors while maintaining data sovereignty and inter-ministerial security protocols.",
                color: "from-blue-500 to-[#137775]"
              },
              {
                title: "Government Consent",
                icon: UserCheck,
                description: "Granular consent management for government personnel with full control over data access, sharing, and processing permissions.",
                color: "from-amber-500 to-orange-600"
              }
            ].map((principle, index) => (
              <Card key={index} className="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex p-4 bg-gradient-to-r ${principle.color} rounded-full mb-4 group-hover:rotate-12 transition-transform duration-300`}>
                    <principle.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    {principle.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                    {principle.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Government Data Management */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Government Data Management Framework
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Comprehensive approach to handling cross-sectoral government information
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#137775] to-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <Card className="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex p-4 bg-gradient-to-r from-[#137775] to-teal-600 rounded-full mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <Database className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  What Government Data We Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#137775] rounded-full"></div>
                    <span>Government official authentication data</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#137775] rounded-full"></div>
                    <span>Cross-sectoral performance metrics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#137775] rounded-full"></div>
                    <span>Agriculture, health, education indicators</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#137775] rounded-full"></div>
                    <span>Resource allocation and planning data</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex p-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <Settings className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  How We Support Governance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Enable evidence-based decision making</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Optimize resource allocation across sectors</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Provide AI-powered intervention recommendations</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Enhance cross-sectoral coordination</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
              <CardHeader className="text-center pb-4">
                <div className="inline-flex p-4 bg-[#137775] rounded-full mb-4 group-hover:rotate-12 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  How We Secure Government Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#137775] rounded-full"></div>
                    <span>Government-grade encryption protocols</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#137775] rounded-full"></div>
                    <span>Rwanda data sovereignty compliance</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#137775] rounded-full"></div>
                    <span>Comprehensive audit trail logging</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-[#137775] rounded-full"></div>
                    <span>Role-based access control systems</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Government User Rights */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Government Personnel Rights
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Comprehensive rights framework for all government platform users
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#137775] to-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Data Access Rights",
                description: "Request comprehensive reports of all government data processing activities",
                icon: Eye,
                color: "from-[#137775] to-teal-600"
              },
              {
                title: "Data Correction Rights",
                description: "Update or correct any inaccurate sectoral or administrative information",
                icon: FileText,
                color: "from-emerald-500 to-teal-600"
              },
              {
                title: "Access Control Rights",
                description: "Manage permissions and restrict access to sensitive government data",
                icon: Shield,
                color: "from-blue-500 to-[#137775]"
              },
              {
                title: "Data Export Rights",
                description: "Export government data in structured formats for external analysis",
                icon: Database,
                color: "from-amber-500 to-orange-600"
              }
            ].map((right, index) => (
              <Card key={index} className="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex p-3 bg-gradient-to-r ${right.color} rounded-full mb-4 group-hover:rotate-12 transition-transform duration-300`}>
                    <right.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    {right.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                    {right.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Government Security Measures */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Government Security Infrastructure
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Advanced protection for sensitive government operations and data
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#137775] to-emerald-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Government SSL/TLS",
                description: "Military-grade 256-bit encryption for all government data transmission and storage",
                icon: Lock,
                color: "from-[#137775] to-teal-600"
              },
              {
                title: "Multi-Factor Authentication",
                description: "Enhanced authentication protocols for government personnel with role verification",
                icon: Key,
                color: "from-emerald-500 to-teal-600"
              },
              {
                title: "Government Data Backup",
                description: "Redundant backup systems with disaster recovery for continuous government operations",
                icon: HardDrive,
                color: "from-blue-500 to-[#137775]"
              },
              {
                title: "Administrative Controls",
                description: "Hierarchical access controls matching government organizational structure",
                icon: Users,
                color: "from-amber-500 to-orange-600"
              }
            ].map((measure, index) => (
              <Card key={index} className="group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-0 shadow-xl">
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex p-3 bg-gradient-to-r ${measure.color} rounded-full mb-4 group-hover:rotate-12 transition-transform duration-300`}>
                    <measure.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    {measure.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                    {measure.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <Card className="bg-[#137775] text-white border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex p-4 bg-white/20 rounded-full mb-4">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              Government Platform Support
            </CardTitle>
            <p className="text-teal-100">
              Dedicated support for Rwanda's government personnel using Intego360 cross-sectoral coordination platform.
            </p>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-lg">
              <h3 className="text-lg font-semibold mb-2">Platform Administrator</h3>
              <p className="text-teal-100 mb-2">Email: admin@intego360.gov.rw</p>
              <p className="text-sm text-teal-200">Government operations support</p>
            </div>
            <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-lg">
              <h3 className="text-lg font-semibold mb-2">Data Protection Officer</h3>
              <p className="text-teal-100 mb-2">Email: privacy@intego360.gov.rw</p>
              <p className="text-sm text-teal-200">Government data privacy concerns</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsAndConditions;