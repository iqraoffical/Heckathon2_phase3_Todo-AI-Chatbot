import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center text-purple-600 hover:text-purple-800 mb-8">
          <span>← Back to Home</span>
        </Link>
        
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/30">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose prose-purple max-w-none">
            <p className="text-gray-700 mb-6">
              At TaskFlow, accessible from https://taskflow.example.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by TaskFlow and how we use it.
            </p>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">General Data Protection Regulation (GDPR)</h2>
              <p className="text-gray-700 mb-4">
                We are a Data Controller of your information. TaskFlow legal basis for collecting and using the personal information described in this Privacy Policy depends on the Personal Information we collect and the specific context in which we collect it.
              </p>
              <p className="text-gray-700">
                TaskFlow will collect and use your personal information for the purposes of: Providing and maintaining our Service; Managing your Account; Performing a contract; Contacting you; Improving our Service; To comply with the law.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                For a better experience, while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to email address, username, and profile information. The information that we request will be retained by us and used as described in this privacy policy.
              </p>
              <p className="text-gray-700">
                The app does use third party services that may collect information used to identify you. Link to privacy policy of third party service providers used by the app:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mt-2">
                <li>Google Analytics</li>
                <li>Stripe Payment Processing</li>
                <li>Cloud Storage Services</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Log Files</h2>
              <p className="text-gray-700">
                TaskFlow follows a standard procedure of using log files. These files log visitors when they visit websites. All hosting companies do this and a part of hosting services' analytics. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, administering the site, tracking users' movement on the website, and gathering demographic information.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Cookies and Web Beacons</h2>
              <p className="text-gray-700">
                Like any other website, TaskFlow uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}