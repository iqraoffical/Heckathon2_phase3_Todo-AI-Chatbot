import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-8">
          <span>← Back to Home</span>
        </Link>
        
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
          
          <div className="prose prose-purple max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to TaskFlow. These terms and conditions outline the rules and regulations for the use of TaskFlow's Website and Services.
              </p>
              <p className="text-gray-700">
                By accessing this website, we assume you accept these terms and conditions. Do not continue to use TaskFlow if you do not agree to all of the terms stated on this page.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">2. Intellectual Property</h2>
              <p className="text-gray-700 mb-4">
                Unless otherwise stated, TaskFlow and/or its licensors own the intellectual property rights for all material on TaskFlow. All intellectual property rights are reserved.
              </p>
              <p className="text-gray-700">
                You may view and/or print pages from https://taskflow.example.com for your own personal use subject to restrictions set in these terms and conditions.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">3. User Responsibilities</h2>
              <p className="text-gray-700 mb-4">
                You warrant and represent that:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>You are entitled to post the Content on our service and have all necessary licenses and consents to do so;</li>
                <li>The Content does not violate the rights of any third party, including but not limited to copyright, trademark, privacy, or other personal or proprietary rights;</li>
                <li>The Content does not contain any defamatory, libelous, offensive, indecent, or otherwise unlawful material which is an invasion of privacy.</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">4. Limitations of Liability</h2>
              <p className="text-gray-700">
                In no event shall TaskFlow, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any loss, damage, injury, or expense arising out of your use of this website, whether under contract, tort, negligence, product liability, or any other legal theory.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}