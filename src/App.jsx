// import React, { useState } from 'react';
// import { Upload, Search, Mic, Lock, Eye, EyeOff, FileText, Image, File, Shield, Key, LogOut, Menu, X, ChevronRight, AlertCircle, CheckCircle } from 'lucide-react';

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showAuth, setShowAuth] = useState(false);
//   const [authStep, setAuthStep] = useState('login');
//   const [authData, setAuthData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: ""
//   });
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [documents, setDocuments] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [isRecording, setIsRecording] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadStatus, setUploadStatus] = useState("");
//   const [showPinModal, setShowPinModal] = useState(false);
//   const [selectedDoc, setSelectedDoc] = useState(null);
//   const [chatMessages, setChatMessages] = useState([
//     { type: 'bot', text: 'Hello! I can help you find information in your documents. Try asking "Show my address from Aadhar card"' }
//   ]);
//   const [currentMessage, setCurrentMessage] = useState('');
//   const sendMessage = async () => {
//     if (!currentMessage.trim()) return;

//     const messageToSend = currentMessage;

//     setChatMessages(prev => [
//       ...prev,
//       { type: "user", text: messageToSend }
//     ]);

//     setCurrentMessage("");

//     try {
//       const response = await fetch("http://localhost:5000/query", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ prompt: messageToSend })
//       });

//       const data = await response.json();

//       setChatMessages(prev => [
//         ...prev,
//         { type: "bot", text: data.response }
//       ]);

//     } catch (error) {
//       setChatMessages(prev => [
//         ...prev,
//         { type: "bot", text: "Error connecting to backend." }
//       ]);
//     }
//   };
//   const handleAuthSubmit = () => {
//     if (authStep === "register") {
//       if (!authData.name || !authData.email || !authData.password || !authData.confirmPassword) {
//         alert("All fields are required.");
//         return;
//       }

//       if (authData.password !== authData.confirmPassword) {
//         alert("Passwords do not match.");
//         return;
//       }
//     } else {
//       if (!authData.email || !authData.password) {
//         alert("Email and password required.");
//         return;
//       }
//     }

//     setIsLoggedIn(true);
//   };

//   // Auth Component
//   const AuthForm = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">
//             {authStep === 'login' ? 'Login' : 'Create Account'}
//           </h2>
//           <button onClick={() => setShowAuth(false)} className="text-gray-400 hover:text-gray-600">
//             <X size={24} />
//           </button>
//         </div>

//         <div className="space-y-4">
//           {authStep === 'register' && (
//             <input
//               type="text"
//               placeholder="Full Name"
//               value={authData.name}
//               onChange={(e) =>
//                 setAuthData({ ...authData, name: e.target.value })
//               }
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />

//           )}
//           <input
//             type="email"
//             placeholder="Email"
//             value={authData.email}
//             onChange={(e) =>
//               setAuthData({ ...authData, email: e.target.value })
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={authData.password}
//             onChange={(e) =>
//               setAuthData({ ...authData, password: e.target.value })
//             }
//             className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//           {authStep === 'register' && (
//             <input
//               type="password"
//               placeholder="Confirm Password"
//               value={authData.confirmPassword}
//               onChange={(e) =>
//                 setAuthData({ ...authData, confirmPassword: e.target.value })
//               }
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             />
//           )}

//           <button
//             onClick={() => setIsLoggedIn(true)}
//             className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
//           >
//             {authStep === 'login' ? 'Login' : 'Create Account'}
//           </button>
//         </div>

//         <div className="mt-6 text-center">
//           <button
//             onClick={() => setAuthStep(authStep === 'login' ? 'register' : 'login')}
//             className="text-blue-600 hover:text-blue-700 font-medium"
//           >
//             {authStep === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Login'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // PIN Modal Component
//   const PinModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8">
//         <div className="text-center mb-6">
//           <Shield className="mx-auto text-blue-600 mb-4" size={48} />
//           <h3 className="text-xl font-bold text-gray-800">Security Verification</h3>
//           <p className="text-gray-600 mt-2">Enter your PIN to access sensitive information</p>
//         </div>

//         <input
//           type="password"
//           placeholder="Enter 4-digit PIN"
//           maxLength="4"
//           className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
//         />

//         <div className="flex gap-3">
//           <button
//             onClick={() => setShowPinModal(false)}
//             className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               setShowPinModal(false);
//               alert('Document accessed successfully!');
//             }}
//             className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//           >
//             Verify
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // Landing Page
//   if (!isLoggedIn) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//         {showAuth && <AuthForm />}

//         {/* Header */}
//         <nav className="bg-white shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-2">
//                 <Shield className="text-blue-600" size={32} />
//                 <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                   SecureVault
//                 </span>
//               </div>
//               <button
//                 onClick={() => setShowAuth(true)}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
//               >
//                 Login
//               </button>
//             </div>
//           </div>
//         </nav>

//         {/* Hero Section */}
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
//           <div className="text-center mb-16">
//             <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
//               Privacy-Preserving Data Vault
//             </h1>
//             <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
//               "Ask Anything — Your Data Answers Securely"
//             </p>
//             <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-12">
//               Store, search, and interact with your personal documents safely using RAG (Retrieval-Augmented Generation)
//               and voice integration. All data is encrypted, stored securely, and retrieved through multi-layer authentication.
//             </p>
//             <button
//               onClick={() => {
//                 setShowAuth(true);
//                 setAuthStep('register');
//               }}
//               className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
//             >
//               Get Started Free
//             </button>
//           </div>

//           {/* Features Grid */}
//           <div className="grid md:grid-cols-3 gap-8 mb-20">
//             <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
//               <Lock className="text-blue-600 mb-4" size={40} />
//               <h3 className="text-xl font-bold text-gray-900 mb-3">End-to-End Encryption</h3>
//               <p className="text-gray-600">
//                 All documents are encrypted using AES/RSA hybrid encryption. Your data remains secure at rest and in transit.
//               </p>
//             </div>

//             <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
//               <Search className="text-indigo-600 mb-4" size={40} />
//               <h3 className="text-xl font-bold text-gray-900 mb-3">AI-Powered Search</h3>
//               <p className="text-gray-600">
//                 Use RAG with Qdrant vector database for intelligent, semantic search across all your documents.
//               </p>
//             </div>

//             <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
//               <Mic className="text-purple-600 mb-4" size={40} />
//               <h3 className="text-xl font-bold text-gray-900 mb-3">Voice Search</h3>
//               <p className="text-gray-600">
//                 Ask questions naturally using voice commands. Get instant answers from your documents.
//               </p>
//             </div>

//             <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
//               <Shield className="text-green-600 mb-4" size={40} />
//               <h3 className="text-xl font-bold text-gray-900 mb-3">Multi-Layer Authentication</h3>
//               <p className="text-gray-600">
//                 Secondary authentication for sensitive data access. Your privacy is our priority.
//               </p>
//             </div>

//             <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
//               <FileText className="text-orange-600 mb-4" size={40} />
//               <h3 className="text-xl font-bold text-gray-900 mb-3">OCR Text Extraction</h3>
//               <p className="text-gray-600">
//                 Automatic text extraction from images and scanned documents for easy searching.
//               </p>
//             </div>

//             <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all">
//               <Key className="text-red-600 mb-4" size={40} />
//               <h3 className="text-xl font-bold text-gray-900 mb-3">AWS KMS Security</h3>
//               <p className="text-gray-600">
//                 Enterprise-grade key management ensures your encryption keys are always secure.
//               </p>
//             </div>
//           </div>

//           {/* Use Cases */}
//           <div className="bg-white rounded-2xl p-12 shadow-xl">
//             <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Perfect For</h2>
//             <div className="grid md:grid-cols-2 gap-8">
//               <div>
//                 <h3 className="text-xl font-bold text-blue-600 mb-3">Students</h3>
//                 <ul className="space-y-2 text-gray-700">
//                   <li className="flex items-start gap-2">
//                     <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
//                     <span>Store Aadhar, PAN, certificates securely</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
//                     <span>Quick access during admissions and exams</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
//                     <span>Voice search for instant information retrieval</span>
//                   </li>
//                 </ul>
//               </div>

//               <div>
//                 <h3 className="text-xl font-bold text-indigo-600 mb-3">Educational Institutions</h3>
//                 <ul className="space-y-2 text-gray-700">
//                   <li className="flex items-start gap-2">
//                     <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
//                     <span>Secure student data management</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
//                     <span>Reduce repetitive document requests</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <CheckCircle className="text-green-500 mt-1 flex-shrink-0" size={20} />
//                     <span>Controlled admin access with authentication</span>
//                   </li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Main Dashboard
//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {showPinModal && <PinModal />}

//       {/* Sidebar */}
//       <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-indigo-700 text-white transition-all duration-300 flex flex-col`}>
//         <div className="p-4 flex items-center justify-between">
//           {sidebarOpen && (
//             <div className="flex items-center gap-2">
//               <Shield size={28} />
//               <span className="font-bold text-xl">SecureVault</span>
//             </div>
//           )}
//           <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg">
//             {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
//           </button>
//         </div>

//         <nav className="flex-1 px-2 py-4 space-y-2">
//           {[
//             { id: 'dashboard', icon: FileText, label: 'Dashboard' },
//             { id: 'documents', icon: File, label: 'My Documents' },
//             { id: 'upload', icon: Upload, label: 'Upload' },
//             { id: 'chat', icon: Search, label: 'AI Assistant' },
//           ].map(item => (
//             <button
//               key={item.id}
//               onClick={() => setActiveTab(item.id)}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
//                 }`}
//             >
//               <item.icon size={20} />
//               {sidebarOpen && <span className="font-medium">{item.label}</span>}
//             </button>
//           ))}
//         </nav>

//         <button
//           onClick={() => setIsLoggedIn(false)}
//           className="mx-2 mb-4 flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
//         >
//           <LogOut size={20} />
//           {sidebarOpen && <span className="font-medium">Logout</span>}
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-auto">
//         {/* Header */}
//         <div className="bg-white shadow-sm px-8 py-4">
//           <div className="flex items-center justify-between">
//             <h1 className="text-2xl font-bold text-gray-800">
//               {activeTab === 'dashboard' && 'Dashboard'}
//               {activeTab === 'documents' && 'My Documents'}
//               {activeTab === 'upload' && 'Upload Documents'}
//               {activeTab === 'chat' && 'AI Assistant'}
//             </h1>
//             <div className="flex items-center gap-4">
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <Shield size={16} className="text-green-500" />
//                 <span>Secured</span>
//               </div>
//               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
//                 VI
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Dashboard Content */}
//         {activeTab === 'dashboard' && (
//           <div className="p-8">
//             <div className="grid md:grid-cols-4 gap-6 mb-8">
//               <div className="bg-white rounded-xl p-6 shadow-sm">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-gray-600">Total Documents</span>
//                   <FileText className="text-blue-600" size={24} />
//                 </div>
//                 <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
//               </div>

//               <div className="bg-white rounded-xl p-6 shadow-sm">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-gray-600">Storage Used</span>
//                   <Image className="text-indigo-600" size={24} />
//                 </div>
//                 <p className="text-3xl font-bold text-gray-900">4.5 GB</p>
//               </div>

//               <div className="bg-white rounded-xl p-6 shadow-sm">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-gray-600">Encrypted</span>
//                   <Lock className="text-green-600" size={24} />
//                 </div>
//                 <p className="text-3xl font-bold text-gray-900">100%</p>
//               </div>

//               <div className="bg-white rounded-xl p-6 shadow-sm">
//                 <div className="flex items-center justify-between mb-2">
//                   <span className="text-gray-600">Queries Today</span>
//                   <Search className="text-purple-600" size={24} />
//                 </div>
//                 <p className="text-3xl font-bold text-gray-900">12</p>
//               </div>
//             </div>

//             <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
//               <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Documents</h2>
//               <div className="space-y-3">
//                 {documents.slice(0, 3).map(doc => (
//                   <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                         {doc.type === 'pdf' ? <FileText className="text-blue-600" /> : <Image className="text-indigo-600" />}
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900">{doc.name}</p>
//                         <p className="text-sm text-gray-500">{doc.size} • {doc.date}</p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => setShowPinModal(true)}
//                       className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
//                     >
//                       View
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
//               <h2 className="text-2xl font-bold mb-3">Try Voice Search</h2>
//               <p className="mb-6 opacity-90">Ask questions like "Show my address from Aadhar card" or "What's my PAN number?"</p>
//               <button
//                 onClick={() => setActiveTab('chat')}
//                 className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all"
//               >
//                 Open AI Assistant
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Documents Tab */}
//         {activeTab === 'documents' && (
//           <div className="p-8">
//             <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
//               <div className="flex items-center gap-4">
//                 <input
//                   type="text"
//                   placeholder="Search documents..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
//                   <Search size={20} />
//                 </button>
//               </div>
//             </div>

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {documents.map(doc => (
//                 <div key={doc.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
//                   <div className="flex items-center justify-between mb-4">
//                     <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
//                       {doc.type === 'pdf' ? <FileText className="text-blue-600" size={32} /> : <Image className="text-indigo-600" size={32} />}
//                     </div>
//                     <div className="flex items-center gap-2 text-green-600 text-sm">
//                       <Lock size={16} />
//                       <span>Encrypted</span>
//                     </div>
//                   </div>

//                   <h3 className="font-bold text-gray-900 mb-2">{doc.name}</h3>
//                   <p className="text-sm text-gray-500 mb-4">{doc.size} • {doc.date}</p>

//                   <button
//                     onClick={() => setShowPinModal(true)}
//                     className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//                   >
//                     View Document
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Upload Tab */}
//         {activeTab === 'upload' && (
//           <div className="p-8">
//             <div className="max-w-2xl mx-auto">
//               <div className="bg-white rounded-xl p-8 shadow-sm">
//                 <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 transition-all cursor-pointer">
//                   <Upload className="mx-auto text-gray-400 mb-4" size={48} />
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Documents</h3>
//                   <p className="text-gray-600 mb-4">Drag and drop files here or click to browse</p>
//                   <p className="text-sm text-gray-500">Supported: PDF, DOCX, PNG, JPG, JPEG (Max 10MB)</p>
//                   <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
//                     Select Files
//                   </button>
//                 </div>

//                 <div className="mt-8 p-6 bg-blue-50 rounded-xl">
//                   <div className="flex items-start gap-3">
//                     <AlertCircle className="text-blue-600 mt-1 flex-shrink-0" size={20} />
//                     <div>
//                       <h4 className="font-bold text-blue-900 mb-1">Security Information</h4>
//                       <p className="text-sm text-blue-700">
//                         All uploaded documents are automatically encrypted using AES-256 encryption before storage.
//                         OCR text extraction will be performed for images and scanned documents.
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//         )}

//         {/* Chat/AI Assistant Tab */}
//         {activeTab === 'chat' && (
//           <div className="p-8 h-[calc(100vh-100px)] flex flex-col">
//             <div className="bg-white rounded-xl shadow-sm flex-1 flex flex-col">

//               <div className="p-6 border-b border-gray-200">
//                 <h2 className="text-xl font-bold text-gray-900">AI Assistant</h2>
//                 <p className="text-sm text-gray-600">
//                   Ask questions about your documents
//                 </p>
//               </div>

//               {/* Messages */}
//               <div className="flex-1 overflow-auto p-6 space-y-4">
//                 {chatMessages.map((msg, idx) => (
//                   <div
//                     key={idx}
//                     className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"
//                       }`}
//                   >
//                     <div
//                       className={`max-w-[70%] p-4 rounded-xl ${msg.type === "user"
//                         ? "bg-blue-600 text-white"
//                         : "bg-gray-100 text-gray-900"
//                         }`}
//                     >
//                       {msg.text}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Input */}
//               <div className="p-6 border-t border-gray-200">
//                 <div className="flex items-center gap-4">

//                   <input
//                     type="text"
//                     value={currentMessage}
//                     onChange={(e) => setCurrentMessage(e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === "Enter") {
//                         sendMessage();
//                       }
//                     }}
//                     placeholder="Type your question..."
//                     className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />

//                   <button
//                     onClick={sendMessage}
//                     className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//                   >
//                     Send
//                   </button>

//                 </div>

//                 <p className="text-xs text-gray-500 mt-2">
//                   Example: "Show my address from Aadhar card"
//                 </p>
//               </div>

//             </div>
//           </div>
//         )}
//       </div>
//     </div >
//   );
// };

// export default App;


import React, { useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function App() {
  const [value, setValue] = useState(dayjs());
  const [timeZone, setTimeZone] = useState("UTC");

  const timeZones = [
    "UTC",
    "America/New_York",
    "Europe/London",
    "Asia/Kolkata",
    "Asia/Tokyo",
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div style={{ padding: 40, maxWidth: 400 }}>
        <h2>MUI DateTime Picker with Timezone</h2>

        {/* Timezone Selector */}
        <TextField
          select
          label="Select Timezone"
          value={timeZone}
          onChange={(e) => setTimeZone(e.target.value)}
          fullWidth
          margin="normal"
        >
          {timeZones.map((tz) => (
            <MenuItem key={tz} value={tz}>
              {tz}
            </MenuItem>
          ))}
        </TextField>

        {/* DateTime Picker */}
        <DateTimePicker
          label="Select Date & Time"
          value={value}
          onChange={(newValue) => setValue(newValue)}
          renderInput={(params) => <TextField {...params} fullWidth />}
        />

        {/* Display Time in Selected Timezone */}
        <div style={{ marginTop: 20 }}>
          <strong>Selected Time ({timeZone}):</strong>
          <p>
            {value ? value.tz(timeZone).format("YYYY-MM-DD HH:mm:ss") : ""}
          </p>
        </div>
      </div>
    </LocalizationProvider>
  );
}